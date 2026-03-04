<?php

namespace App\Http\Controllers;

use App\Models\Campaigns;
use App\Models\Discount;
use App\Models\Currency;
use App\Models\Language;
use App\Models\Translation;
use App\Models\TranslationKey;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use DOMDocument;

class CampaignsController extends Controller
{
    public function showAll()
    {
    $campaigns = Campaigns::with('translationKey:id,key')
    ->select('id', 'title', 'content', 'photo_path', 'start_date', 'end_date', 'slug_translation_key_id')
    ->where('status', 'active')
    ->get();

        return Inertia::render('Campaigns', [
            'campaigns' => $campaigns,
        ]);
    }

    public function showAllAdminPanel()
    {
        $campaigns = Campaigns::with('translationKey:id,key')->get();

        return Inertia::render('adminPanel/campaigns/Campaigns', [
            'campaigns' => $campaigns,
            'success' => session('success'),
        ]);
    }

    public function showIndex($slug)
    {
        $locale = app()->getLocale();
        $campaign = Campaigns::whereHas('translationKey.translations', function ($query) use ($slug, $locale) {
            $query->where('value', $slug)
                ->where('language_id', Language::where('code', $locale)->first()->id);
        })->firstOrFail();
        if($campaign)
            return Inertia::render('CampaignsIndex', ['campaign' => $campaign,]);
        else
            return Inertia::render('NotFound');
    }

    public function showIndexAdminPanel($slug)
    {
        $locale = app()->getLocale();
        $campaign = Campaigns::whereHas('translationKey.translations', function ($query) use ($slug, $locale) {
            $query->where('value', $slug)
                ->where('language_id', Language::where('code', $locale)->first()->id);
        })->with(['discounts', 'translationKey.translations.language'])->firstOrFail();
        $languages = getActiveLanguages();

        // Transform slug translations to key-value pairs by language code
        $slug = [];
        if ($campaign->translationKey) {
            foreach ($campaign->translationKey->translations as $translation) {
                $slug[$translation->language->code] = $translation->value;
            }
        }
        $campaign->slug = $slug;

        return Inertia::render('adminPanel/campaigns/Campaign', [
            'languages' => $languages,
            'campaign' => $campaign,
            'success' => session('success'),
        ]);
    }

    public function addCampaign(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|json',
            'slug' => 'required|json',
            'content' => 'required|json',
            'image' => 'required|file|image|mimes:jpeg,png,jpg|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'selectedDiscount' => 'nullable|string',
            'dayDiscounts' => 'nullable|json',
            'hasDiscount' => 'nullable|int',
            'discountTarget' => 'nullable|string',
        ]);

        // Validate slug uniqueness
        $slugs = json_decode($validated['slug'], true);
        $languages = Language::all();
        foreach ($slugs as $lang => $slugValue) {
            $language = $languages->where('code', $lang)->first();
            if (!$language) continue;
            
            $exists = Translation::join('translation_keys', 'translations.translation_key_id', '=', 'translation_keys.id')
                ->where('translations.language_id', $language->id)
                ->where('translations.value', $slugValue)
                ->where('translation_keys.key', 'like', 'address.campaign-%')
                ->exists();
            if ($exists) {
                throw ValidationException::withMessages([
                    'slug' => "{$lang} dili icin girilen slug degeri zaten mevcut."
                ]);
            }
        }

        try {
            DB::beginTransaction();

            // Create translation key for slug
            $keyString = 'address.campaign-' . Str::lower(Str::random(8));
            $translationKey = TranslationKey::create(['key' => $keyString]);

            // Create translations for each language
            foreach ($slugs as $lang => $slugValue) {
                $language = $languages->where('code', $lang)->first();
                if ($language) {
                    Translation::create([
                        'translation_key_id' => $translationKey->id,
                        'language_id' => $language->id,
                        'value' => $slugValue
                    ]);
                }
            }

            $startDate = Carbon::parse($validated['start_date']);
            $endDate = Carbon::parse($validated['end_date']);
            $currentDate = Carbon::now();

            $contentArray = json_decode($validated['content'], true);
            $processedContent = [];

            foreach ($contentArray as $lang => $htmlContent) {
                $processedContent[$lang] = $this->processContentImages($htmlContent);
            }

            $campaign = new Campaigns();
            $campaign->title = json_decode($validated['title'], true);
            $campaign->slug_translation_key_id = $translationKey->id;
            $campaign->content = $processedContent;
            $campaign->start_date = $startDate;
            $campaign->end_date = $endDate;
            $campaign->status = $currentDate->between($startDate, $endDate) ? 'active' : 'inactive';

            if ($request->hasFile('image')) {
                $campaign->photo_path = $request->file('image')->store('campaigns', 'public');
            }

            $campaign->save();

            if ($validated['hasDiscount']) {
                $discounts = json_decode($validated['dayDiscounts'], true);

                foreach ($discounts as $discount) {
                    $this->addDiscountToCampaign(
                        $campaign->id,
                        $discount,
                        $validated['selectedDiscount'],
                        $validated['discountTarget'] ?? null,
                        $startDate,
                        $endDate
                    );
                }
            }

            DB::commit();

            clearTranslationCache();

            return Inertia::render('adminPanel/campaigns/AddCampaign', [
                'languages' => getActiveLanguages(),
                'success' => 'Kampanya ve indirimler başarıyla eklendi!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return Inertia::render('adminPanel/campaigns/AddCampaign', [
                'error' => 'Bir hata oluştu: ' . $e->getMessage(),
            ]);
        }
    }

    private function processContentImages($htmlContent)
    {
        if (empty($htmlContent)) {
            return $htmlContent;
        }

        $dom = new DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($htmlContent, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $images = $dom->getElementsByTagName('img');

        foreach ($images as $img) {
            $src = $img->getAttribute('src');

            if (preg_match('/^data:image\/(\w+);base64,/', $src, $type)) {
                $data = substr($src, strpos($src, ',') + 1);
                $type = strtolower($type[1]);

                if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png', 'webp'])) {
                    continue;
                }

                $data = base64_decode($data);
                if ($data === false) {
                    continue;
                }

                $fileName = 'campaign_content_' . time() . '_' . Str::random(10) . '.' . $type;
                $filePath = 'uploads/campaign_content/' . $fileName;

                Storage::disk('public')->put($filePath, $data);

                $img->removeAttribute('src');
                $img->setAttribute('src', Storage::url($filePath));
            }
        }

        return $dom->saveHTML();
    }

    private function addDiscountToCampaign(
        int $campaignId,
        array $discount,
        ?string $selectedDiscount,
        ?string $targetData,
        Carbon $startDate,
        Carbon $endDate
    ) {
        if (!isset($discount['min_day'], $discount['max_day']) || $discount['min_day'] >= $discount['max_day']) {
            return;
        }

        $currentDate = Carbon::now();
        $cur_id = Currency::where('code', $discount['currency'] ?? 'TRY')->first()->id ?? null;

        $discountModel = new Discount();
        $discountModel->campaign_id = $campaignId;
        $discountModel->min_days = $discount['min_day'];
        $discountModel->max_days = $discount['max_day'];
        $discountModel->discount_value = $discount['discount_amount'] ?? 0;
        $discountModel->discount_type = $discount['discount_type'];
        $discountModel->currency_id = $cur_id;
        $discountModel->target_type = $selectedDiscount;

        if($discount['discount_type'] === "percentage")
            $discountModel->discount_value = (float) ($discount['discount_amount'] / 100);
        else
            $discountModel->discount_value = $discount['discount_amount'];

        if ($selectedDiscount === 'segment') {
            $discountModel->segment_id = $targetData;
        }

        if ($selectedDiscount === 'car') {
            $discountModel->car_group_id = $targetData;
        }

        $discountModel->start_date = $startDate;
        $discountModel->end_date = $endDate;
        $discountModel->status = $currentDate->between($startDate, $endDate) ? 'active' : 'inactive';

        $discountModel->save();
    }

    public function deleteCampaign(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:campaigns,id',
        ]);

        $campaign = Campaigns::findOrFail($request->id);

        if ($campaign->photo_path && Storage::disk('public')->exists($campaign->photo_path)) {
            Storage::disk('public')->delete($campaign->photo_path);
        }

        $campaign->delete();

        return redirect()->route('showAllCampaignsAdminPanel')->with('success', 'Kampanya silindi!');
    }

    public function updateCampaign(Request $request, $id)
    {
        $campaign = Campaigns::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|json',
            'slug' => 'required|json',
            'content' => 'required|json',
            'image' => 'nullable|file|image|mimes:jpeg,png,jpg|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'selectedDiscount' => 'nullable|string',
            'dayDiscounts' => 'nullable|json',
            'hasDiscount' => 'nullable|int',
            'discountTarget' => 'nullable|string',
        ]);

        // Validate slug uniqueness (exclude current campaign's translation key)
        $slugs = json_decode($validated['slug'], true);
        $languages = Language::all();
        foreach ($slugs as $lang => $slugValue) {
            $language = $languages->where('code', $lang)->first();
            if (!$language) continue;
            
            $query = Translation::join('translation_keys', 'translations.translation_key_id', '=', 'translation_keys.id')
                ->where('translations.language_id', $language->id)
                ->where('translations.value', $slugValue)
                ->where('translation_keys.key', 'like', 'address.campaign-%');
            
            if ($campaign->slug_translation_key_id) {
                $query->where('translations.translation_key_id', '!=', $campaign->slug_translation_key_id);
            }
            
            if ($query->exists()) {
                throw ValidationException::withMessages([
                    'slug' => "{$lang} dili icin girilen slug degeri zaten mevcut."
                ]);
            }
        }

        try {
            DB::beginTransaction();

            // Handle translation key for slug
            if ($campaign->slug_translation_key_id) {
                // Update existing translations
                foreach ($slugs as $lang => $slugValue) {
                    $language = $languages->where('code', $lang)->first();
                    if ($language) {
                        Translation::updateOrCreate(
                            [
                                'translation_key_id' => $campaign->slug_translation_key_id,
                                'language_id' => $language->id,
                            ],
                            ['value' => $slugValue]
                        );
                    }
                }
            } else {
                // Create new translation key
                $keyString = 'address.campaign-' . Str::lower(Str::random(8));
                $translationKey = TranslationKey::create(['key' => $keyString]);
                
                foreach ($slugs as $lang => $slugValue) {
                    $language = $languages->where('code', $lang)->first();
                    if ($language) {
                        Translation::create([
                            'translation_key_id' => $translationKey->id,
                            'language_id' => $language->id,
                            'value' => $slugValue
                        ]);
                    }
                }
                
                $campaign->slug_translation_key_id = $translationKey->id;
            }

            $startDate = Carbon::parse($validated['start_date']);
            $endDate = Carbon::parse($validated['end_date']);
            $currentDate = Carbon::now();

            $contentArray = json_decode($validated['content'], true);
            $processedContent = [];

            foreach ($contentArray as $lang => $htmlContent) {
                $processedContent[$lang] = $this->processContentImages($htmlContent);
            }

            $campaign->title = json_decode($validated['title'], true);
            $campaign->content = $processedContent;
            $campaign->start_date = $startDate;
            $campaign->end_date = $endDate;
            $campaign->status = $currentDate->between($startDate, $endDate) ? 'active' : 'inactive';

            if ($request->hasFile('image')) {
                if ($campaign->photo_path && Storage::disk('public')->exists($campaign->photo_path)) {
                    Storage::disk('public')->delete($campaign->photo_path);
                }
                $campaign->photo_path = $request->file('image')->store('campaigns', 'public');
            }

            $campaign->save();

            Discount::where('campaign_id', $campaign->id)->delete();

            if ($validated['hasDiscount']) {
                $discounts = json_decode($validated['dayDiscounts'], true);
                foreach ($discounts as $discount) {
                    $this->addDiscountToCampaign(
                        $campaign->id,
                        $discount,
                        $validated['selectedDiscount'],
                        $validated['discountTarget'] ?? null,
                        $startDate,
                        $endDate
                    );
                }
            }

            DB::commit();

            clearTranslationCache();

            return redirect()->route('showIndexAdminPanel', $campaign->id)->with('success', 'Kampanya güncellendi!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Bir hata oluştu: ' . $e->getMessage());
        }
    }
}

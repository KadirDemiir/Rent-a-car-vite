<?php

namespace App\Http\Controllers;

use App\Models\Campaigns;
use App\Models\Discount;
use App\Models\Language;
use App\Models\Currency;
use App\Models\Segment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CampaignsController extends Controller
{
    public function showAll()
    {
        $campaigns = Campaigns::all();

        return Inertia::render('Campaigns', [
            'campaigns' => $campaigns,
        ]);
    }

    public function showAllAdminPanel()
    {
        $campaigns = Campaigns::all();

        return Inertia::render('adminPanel/campaigns/Campaigns', [
            'campaigns' => $campaigns,
            'success' => session('success'),
        ]);
    }

    public function showIndex($id)
    {
        $campaign = Campaigns::findOrFail($id);
        return Inertia::render('CampaignsIndex', [
            'campaign' => $campaign,
        ]);
    }

    public function showIndexAdminPanel($id)
    {
        $campaign = Campaigns::with('discounts')->findOrFail($id);
        $languages = Language::where('status', 'active')->get();

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
            'content' => 'required|json',
            'image' => 'required|file|image|mimes:jpeg,png,jpg|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'selectedDiscount' => 'nullable|string',
            'dayDiscounts' => 'nullable|json',
            'hasDiscount' => 'nullable|int',
            'discountTarget' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $startDate = Carbon::parse($validated['start_date']);
            $endDate = Carbon::parse($validated['end_date']);
            $currentDate = Carbon::now();

            $campaign = new Campaigns();
            $campaign->title = json_decode($validated['title'], true);
            $campaign->content = json_decode($validated['content'], true);
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

            return Inertia::render('adminPanel/campaigns/AddCampaign', [
                'languages' => Language::where('status', 'active')->get(),
                'success' => 'Kampanya ve indirimler başarıyla eklendi!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return Inertia::render('adminPanel/campaigns/AddCampaign', [
                'error' => 'Bir hata oluştu: ' . $e->getMessage(),
            ]);
        }
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
            $discountModel->car_id = $targetData;
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

        if (
            $campaign->photo_path &&
            str_starts_with($campaign->photo_path, 'campaigns/') &&
            Storage::disk('public')->exists($campaign->photo_path)
        ) {
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
            'content' => 'required|json',
            'image' => 'nullable|file|image|mimes:jpeg,png,jpg|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'selectedDiscount' => 'nullable|string',
            'dayDiscounts' => 'nullable|json',
            'hasDiscount' => 'nullable|int',
            'discountTarget' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $startDate = Carbon::parse($validated['start_date']);
            $endDate = Carbon::parse($validated['end_date']);
            $currentDate = Carbon::now();

            $campaign->title = $validated['title'];
            $campaign->content = $validated['content'];
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

            return redirect()->route('showIndexAdminPanel', $campaign->id)->with('success', 'Kampanya güncellendi!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Bir hata oluştu: ' . $e->getMessage());
        }
    }
}

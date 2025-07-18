<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountController extends Controller
{
    public function addDiscount(Request $request)
    {
        $validated = $request->validate([
            'selectedDiscount' => 'required|string',
            'discountTarget' => 'nullable|string',
            'dayDiscount' => 'required|json',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after:startDate',
        ]);

        $discounts = json_decode($validated['dayDiscount'], true);

        if (!is_array($discounts)) {
            return Inertia::render('adminPanel/price/AddDiscount', [
                'error' => 'İndirim verileri hatalı veya boş.'
            ]);
        }
        try {
            foreach ($discounts as $discount) {
                if (!$discount['min_day'] && !$discount['max_day'] && !$discount['discount_amount']) {
                    continue;
                }
                $newDiscount = new Discount();
                $newDiscount->discount_type = $discount['discount_type'];
                $newDiscount->discount_value = $discount['discount_amount'];
                if ($discount['discount_type'] === "fixed") {
                    $newDiscount->currency = $discount['currency'];
                }
                $newDiscount->target_type = $validated['selectedDiscount'];
                $newDiscount->min_days = $discount['min_day'];
                $newDiscount->max_days = $discount['max_day'];

                if ($validated['selectedDiscount'] === "segment") {
                    $newDiscount->segment_name = $validated['discountTarget'];
                }

                $newDiscount->start_date = $validated['startDate'];
                $newDiscount->end_date = $validated['endDate'];
                $newDiscount->save();
            }
            return Inertia::render('adminPanel/price/AddDiscount', [
                'success' => 'İndirim başarıyla kaydedildi.'
            ]);
        } catch (\Exception $e) {
            return Inertia::render('adminPanel/price/AddDiscount', [
                'error' => 'İndirimler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin. ' . $e->getMessage()
            ]);
        }
    }

}

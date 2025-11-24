<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use function Laravel\Prompts\error;

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
        Log::info($discounts);
        if (!is_array($discounts)) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid or empty discount data.'
            ], 422);
        }

        $start = $validated['startDate'];
        $end = $validated['endDate'];

        $overlap = Discount::where(function ($q) use ($start, $end) {
            $q->where('start_date', '<=', $end)
                ->where('end_date', '>=', $start);
        })->exists();

        if ($overlap) {
            return response()->json([
                'success' => false,
                'error' => 'There is an overlap in the selected date range.'
            ]);
        }
        Log::info(1);
        try {
            foreach ($discounts as $discount) {
                if (!$discount['min_day'] && !$discount['max_day'] && !$discount['discount_amount']) {
                    continue;
                }

                $newDiscount = new Discount();
                $newDiscount->discount_type = $discount['discount_type'];

                if ($discount['discount_type'] === "fixed") {
                    $newDiscount->currency_id = $discount['currency'];
                    $newDiscount->discount_value = $discount['discount_amount'];
                }
                else
                    $newDiscount->discount_value = (float) ($discount['discount_amount'] / 100);

                $newDiscount->target_type = $validated['selectedDiscount'];
                $newDiscount->min_days = $discount['min_day'];
                $newDiscount->max_days = $discount['max_day'];

                if ($validated['selectedDiscount'] === "segment") {
                    $newDiscount->segment_id = $validated['discountTarget'];
                }

                $newDiscount->start_date = $start;
                $newDiscount->end_date = $end;
                $newDiscount->save();
            }

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

}


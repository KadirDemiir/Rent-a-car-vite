<?php

namespace App\Http\Controllers;

use App\Models\Campaigns;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function Termwind\render;

class CampaignsController extends Controller
{

    public function showAll(){
        $campaigns = Campaigns::all();
        return Inertia::render('Campaigns', [
            'campaigns' => $campaigns
        ]);
    }

    public function showIndex($id)
    {
        $campaign = Campaigns::where('id', $id);
        return Inertia::render('CampaignsIndex', [
            'campaign' => $campaign
        ]);
        
    }
}

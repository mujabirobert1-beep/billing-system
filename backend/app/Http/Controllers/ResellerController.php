<?php

namespace App\Http\Controllers;

use App\Models\Reseller;
use Illuminate\Support\Facades\Response;

class ResellerController extends Controller
{
    public function dashboard()
    {
        $resellers = Reseller::with(['sites.routers', 'walletTransactions'])->get();

        return Response::json(['resellers' => $resellers]);
    }
}

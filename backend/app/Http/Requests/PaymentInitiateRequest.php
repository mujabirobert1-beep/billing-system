<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentInitiateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => 'required|string',
            'amount' => 'required|integer|min:100',
            'customer_name' => 'required|string',
            'router_id' => 'required|integer|exists:routers,id',
        ];
    }
}

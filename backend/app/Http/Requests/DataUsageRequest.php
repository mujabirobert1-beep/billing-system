<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DataUsageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => 'required|integer|exists:customers,id',
            'router_id' => 'required|integer|exists:routers,id',
            'bytes_up' => 'required|integer|min:0',
            'bytes_down' => 'required|integer|min:0',
            'online' => 'required|boolean',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthVerifyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => 'required|string',
            'code' => 'required|string',
            'email' => 'nullable|email',
        ];
    }
}

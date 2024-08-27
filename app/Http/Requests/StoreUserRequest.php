<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
{
    return [
        'name' => 'required|string|max:55',
        'email' => 'required|email|unique:users,email',
        'username' => [
            'required',
            'string',
            'min:4',  // Minimum length of 4 characters
            'unique:users,username',  // Ensure username is unique in the users table
        ],
        'password' => [
            'required',
            Password::min(8)
                ->letters()
                ->symbols(),
        ],
    ];
}

}

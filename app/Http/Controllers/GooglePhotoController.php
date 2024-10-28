<?php

namespace App\Http\Controllers;

use App\Models\GooglePhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GooglePhotoController extends Controller
{
    public function index()
    {
        return response()->json(GooglePhoto::all(), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|string',
            'client_secret' => 'required|string',
            'refresh_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $googlePhoto = GooglePhoto::create($request->all());
        return response()->json($googlePhoto, 201);
    }

    public function show($id)
    {
        $googlePhoto = GooglePhoto::find($id);
        if (!$googlePhoto) {
            return response()->json(['message' => 'Not Found'], 404);
        }
        return response()->json($googlePhoto, 200);
    }

    public function update(Request $request, $id)
    {
        $googlePhoto = GooglePhoto::find($id);
        if (!$googlePhoto) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'client_id' => 'string',
            'client_secret' => 'string',
            'refresh_token' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $googlePhoto->update($request->all());
        return response()->json($googlePhoto, 200);
    }

    public function destroy($id)
    {
        $googlePhoto = GooglePhoto::find($id);
        if (!$googlePhoto) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $googlePhoto->delete();
        return response()->json(['message' => 'Deleted Successfully'], 204);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    // Display a listing of the resource.
    public function index()
    {
        return Work::all();
    }

    // Store a newly created resource in storage.
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'Today_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
        ]);

        $work = Work::create($request->all());

        return response()->json($work, 201);
    }

    // Display the specified resource.
    public function show($id)
    {
        $work = Work::findOrFail($id);
        return response()->json($work);
    }

    // Update the specified resource in storage.
    public function update(Request $request, $id)
    {
        $work = Work::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'Today_date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|max:255',
        ]);

        $work->update($request->all());

        return response()->json($work);
    }

    // Remove the specified resource from storage.
    public function destroy($id)
    {
        $work = Work::findOrFail($id);
        $work->delete();

        return response()->json(null, 204);
    }
}

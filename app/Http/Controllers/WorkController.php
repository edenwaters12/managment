<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    // Display a listing of the resource.
    public function index(Request $request)
    {
        $query = Work::query();
        
        // Filter by category if provided
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Sort by today_date in ascending order
        $query->orderBy('today_date', 'desc');

        // Fetch the todos
        $Works = $query->get();

        return response()->json($Works);
    }

    // Store a newly created resource in storage.
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string',
            'Today_date' => 'nullable|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'description' => 'nullable',
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
            'title' => 'sometimes|string|max:255',
            'Today_date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'description' => 'sometimes',
            'category' => 'sometimes|string|max:255',
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

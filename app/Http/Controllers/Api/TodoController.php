<?php

namespace App\Http\Controllers\Api;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{

    
    // Fetch todos with optional category filtering and sorting by today_date in ascending order
    public function index(Request $request)
    {
        $query = Todo::query();
        
        // Filter by category if provided
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Sort by today_date in ascending order
        $query->orderBy('today_date', 'desc');

        // Fetch the todos
        $todos = $query->get();

        return response()->json($todos);
    }

    // Show a single todo
    public function show($id)
    {
        return Todo::findOrFail($id);
    }

    // Create a new todo
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'todayDate' => 'nullable|date',
            'startDate' => 'nullable|date_format:H:i',
            'endDate' => 'nullable|date_format:H:i',
            'category' => 'nullable|string',
            'topic' => 'nullable|string',
        ]);

        $todo = Todo::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'today_date' => $request->input('todayDate'),
            'start_date' => $request->input('startDate'),
            'end_date' => $request->input('endDate'),
            'category' => $request->input('category'),
            'topic' => $request->input('topic'),
        ]);

        return response()->json($todo, 201);
    }

    // Update an existing todo
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'todayDate' => 'nullable|date',
            'startDate' => 'nullable|date_format:H:i',
            'endDate' => 'nullable|date_format:H:i',
            'category' => 'required|string',
            'topic' => 'nullable|string',
        ]);

        $todo = Todo::findOrFail($id);
        $todo->update([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'today_date' => $request->input('todayDate'),
            'start_date' => $request->input('startDate'),
            'end_date' => $request->input('endDate'),
            'category' => $request->input('category'),
            'topic' => $request->input('topic'),
        ]);

        return response()->json($todo);
    }

    // Delete a todo
    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();

        return response()->noContent();
    }
}
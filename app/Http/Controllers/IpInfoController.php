<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LoginLog;
use Illuminate\Support\Facades\Http;

class IpInfoController extends Controller
{
    public function getIpInfo()
    {
        // Fetch IP information from ipinfo.io
        $response = Http::get('https://ipinfo.io/json?token=9b203c2cebb8bc');

        // Return the response back to the client as JSON
        return response()->json($response->json(),200);
    }
    public function index()
    {
        // Fetch all IP information records
        $LoginLogs = LoginLog::orderBy('created_at', 'desc')->get();

        // Return the records as JSON
        return response()->json($LoginLogs,200);
    }

    public function delete(Request $request, $id = null)
    {
        if ($id) {
            // Delete the specific record by ID
            $LoginLog = LoginLog::find($id);

            if ($LoginLog) {
                $LoginLog->delete();
                return response()->json(['message' => 'IP information deleted successfully.'], 200);
            } else {
                return response()->json(['message' => 'IP information not found.'], 404);
            }
        } else {
            // Delete all records if no ID is provided
            LoginLog::truncate();
            return response()->json(['message' => 'All IP information deleted successfully.'], 200);
        }
    }
}


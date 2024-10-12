<?php

namespace App\Http\Controllers;

use Google\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class GoogleAuthController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setApplicationName('Your App Name');
        $this->client->setScopes([
            "https://www.googleapis.com/auth/drive",
            'https://www.googleapis.com/auth/photoslibrary',
            'https://www.googleapis.com/auth/photoslibrary.readonly',
            'https://www.googleapis.com/auth/contacts.readonly'
        ]);
        $this->client->setAuthConfig(storage_path('app/credentials.json'));
    }

    public function redirectToGoogle()
    {
        $authUrl = $this->client->createAuthUrl();
        return redirect()->away($authUrl);
    }

    public function handleGoogleCallback(Request $request)
    {
        // Exchange the authorization code for an access token
        $this->client->authenticate($request->get('code'));
        $token = $this->client->getAccessToken();
    
        // Check if the token is received successfully
        if (empty($token['access_token'])) {
            return redirect('/')->with('error', 'Failed to obtain access token.');
        }
    
        // Save the token in a JSON file in the tokens folder
        $userId = Auth::id(); // Assuming you're using Laravel's Auth system
        $tokenFilePath = storage_path("app/tokens/token_{$userId}.json");
    
        // Store the token in a file
        if (!file_exists($tokenFilePath)) {
            Storage::put("tokens/token_{$userId}.json", json_encode($token));
        } else {
            // If the token file already exists, you may want to overwrite it or handle it differently
            Storage::put("tokens/token_{$userId}.json", json_encode($token));
        }
    
        // Optional: Save the token details in the database if needed
        UserToken::updateOrCreate(
            ['token' => $token['access_token']], // Ensure this is unique if needed
            [
                'refresh_token' => $token['refresh_token'] ?? null, // Extract refresh token
                'token_uri' => $this->client->getConfig('token_uri'), // Get the token URI
                'client_id' => $this->client->getConfig('client_id'), // Get the client ID
                'client_secret' => $this->client->getConfig('client_secret'), // Get the client secret
                'scopes' => json_encode($token['scope'] ?? []), // Get the scopes
            ]
        );
    
        return redirect('/home')->with('success', 'Google authentication successful.');
    }
    

    public function getToken()
    {
        $userId = Auth::id();
        $tokenFilePath = storage_path("app/tokens/token_{$userId}.json");

        if (!file_exists($tokenFilePath)) {
            return response()->json(['error' => 'Token not found'], 404);
        }

        $tokenJson = Storage::get("tokens/token_{$userId}.json");
        return json_decode($tokenJson, true);
    }
}

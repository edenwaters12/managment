<?php

use App\Http\Controllers\RowItemController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\WorkController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum', 'auto.logout'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);
    // Todos
    Route::get('/todos', [TodoController::class, 'index']);
    Route::get('/todos/{id}', [TodoController::class, 'show']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::put('/todos/{id}', [TodoController::class, 'update']);
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);    
    
    //  Work
    Route::get('/works', [WorkController::class, 'index']);
    Route::get('/works/{id}', [WorkController::class, 'show']);
    Route::post('/works', [WorkController::class, 'store']);
    Route::put('/works/{id}', [WorkController::class, 'update']);
    Route::delete('/works/{id}', [WorkController::class, 'destroy']);    

    // row-items
    Route::get('/rows', [RowItemController::class, 'index']);          
    Route::post('/row', [RowItemController::class, 'store']);          
    Route::get('/row/{id}', [RowItemController::class, 'show']);       
    Route::put('/row/{id}', [RowItemController::class, 'update']);     
    Route::delete('/row/{id}', [RowItemController::class, 'destroy']);

    // API route for downloading a file
    Route::get('row/{id}/download/{fileName}', [RowItemController::class, 'download']);

    
    
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);


<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('users', 'UserController@postCreate');
Route::get('users/{tgUserId}', 'UserController@getUser');
Route::get('users/nfts/{tgUserId}:claim', 'TaskController@getClaimNft');

Route::post('tasks', 'TaskController@postCreateTask');
Route::get('tasks/users/{tgUserId}', 'TaskController@getUserAllTasks');

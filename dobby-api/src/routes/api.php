<?php

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

Route::post('users', 'UserController@postCreate');
Route::get('users/{tgUserId}', 'UserController@getUser');

Route::post('tasks', 'TaskController@postCreateTask');
Route::get('tasks/users/{tgUserId}', 'TaskController@getUserAllTasks');
Route::get('tasks/users:reply', 'TaskController@getCheckUserReply');

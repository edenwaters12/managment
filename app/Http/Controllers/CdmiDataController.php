<?php

namespace App\Http\Controllers;

use App\Models\CdmiData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CdmiDataController extends Controller
{
    // Create a new CdmiData
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'title' => 'required|string|max:255',
            'isDelete' => 'string|max:255',
            'files.*' => 'max:4048000' // Max size 2GB
        ]);

        // Handle file uploads
        $filePaths = [];
        if ($request->hasFile('files')) {
            $index = 1; // Initialize the index for naming files
            foreach ($request->file('files') as $file) {

                $extension = $file->getClientOriginalExtension();

                $dateTime = now()->format('Y-m-d_His'); 

                // Generate the new file name with an index
                $fileName = "{$index}_{$request->input('title')}_{$request->input('isDelete')}_{$dateTime}.{$extension}";

                // Store the file with the new name in the cdmi folder
                $path = $file->storeAs('uploads/cdmi', $fileName, 'public');

                // Save the path in the filePaths array
                $filePaths[] = $path;

                // Increment the index for the next file
                $index++;
            }
        }

        // Store the data in the database
        $rowItem = CdmiData::create([
            'title' => $request->title,
            'description' => $request->description,
            'isDelete' => $request->isDelete,
            'files' => json_encode($filePaths),
        ]);

        return response()->json($rowItem, 201);
    }

    // Retrieve all CdmiData
    public function index()
    {
        $cdmidata = CdmiData::orderBy('created_at', 'desc')->get();
        return response()->json($cdmidata, 200);
    }

    // Retrieve a specific CdmiData by ID
    public function show($id)
    {
        $rowItem = CdmiData::find($id);

        if (!$rowItem) {
            return response()->json(['message' => 'CdmiData not found'], 404);
        }

        return response()->json($rowItem, 200);
    }

    // Update a specific CdmiData by ID
    public function update(Request $request, $id)
    {
        $rowItem = CdmiData::find($id);

        if (!$rowItem) {
            return response()->json(['message' => 'CdmiData not found'], 404);
        }

        // Validate the request
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes',
            'isDelete' => 'sometimes|string|max:255',
            'files.*' => 'max:4048000' // Max size 2GB
        ]);

        // Handle file uploads
        $filePaths = json_decode($rowItem->files, true);
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                // Store new files in the cdmi folder
                $path = $file->store('uploads/cdmi', 'public');
                $filePaths[] = $path;
            }
        }

        // Update the data
        $rowItem->update([
            'title' => $request->input('title', $rowItem->title),
            'description' => $request->input('description', $rowItem->description),
            'isDelete' => $request->input('isDelete', $rowItem->isDelete),
            'files' => json_encode($filePaths),
        ]);

        return response()->json($rowItem, 200);
    }

    // Delete a specific CdmiData by ID
    public function destroy($id)
    {
        $rowItem = CdmiData::find($id);

        if (!$rowItem) {
            return response()->json(['message' => 'CdmiData not found'], 404);
        }

        // // Delete associated files
        // $files = json_decode($rowItem->files, true);
        // if ($files) {
        //     foreach ($files as $file) {
        //         // Add cdmi folder path to each file
        //         Storage::disk('public')->delete($file);
        //     }
        // }

        // // Delete the RowItem
        // $rowItem->delete();

        // return response()->json(['message' => 'CdmiData deleted successfully'], 200);
        
        //  Move the file for the delete foldert
        $files = json_decode($rowItem->files, true);
        if ($files) {
        foreach ($files as $file) {
            // Get the original file path
            $originalPath = "public/{$file}";

            // Construct the new path in the "delete" folder
            $fileName = basename($file);
            $newPath = "uploads/cdmi/delete/{$fileName}";

            // Move the file
            if (Storage::exists($originalPath)) {
                Storage::move($originalPath, "public/{$newPath}");
            }
        }
    }



        // Update for the deletion in delete than True
        $rowItem->update([
            'isDelete' => $request->input('isDelete', $rowItem->isDelete),
        ]);

        return response()->json($rowItem, 200);
    }

    // Download all files as a ZIP
    public function download($id)
    {
        // Find the RowItem entry by ID
        $rowItem = CdmiData::find($id);

        if (!$rowItem) {
            return response()->json(['message' => 'CdmiData not found'], 404);
        }

        // Decode the file paths from the database
        $files = json_decode($rowItem->files, true);

        if (empty($files)) {
            return response()->json(['message' => 'No files to download'], 404);
        }

        // Create a ZIP file
        $zip = new \ZipArchive();
        $zipFileName = "row_item_{$id}_files.zip";
        $zipFilePath = storage_path("app/public/{$zipFileName}");

        if ($zip->open($zipFilePath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            return response()->json(['message' => 'Failed to create ZIP file'], 500);
        }

        // Add files to the ZIP archive
        foreach ($files as $file) {
            $filePath = storage_path("app/public/{$file}");
            if (file_exists($filePath)) {
                $zip->addFile($filePath, basename($file)); // Add the file to the ZIP archive
            }
        }

        // Close the ZIP archive
        $zip->close();

        // Return the ZIP file for download
        return response()->download($zipFilePath)->deleteFileAfterSend(true);
    }
}

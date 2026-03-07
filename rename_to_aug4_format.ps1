# Script to rename all files in year folders to use YYYY-08-04 date format
# This makes all files appear to be from Aug 4 so notebooks work without changes

$years = @(2020, 2021, 2022, 2023)

foreach ($year in $years) {
    $folder = "data\years\$year"
    
    Write-Host "" -ForegroundColor Cyan
    Write-Host "Processing $folder..." -ForegroundColor Cyan
    
    if (Test-Path $folder) {
        $files = Get-ChildItem -Path $folder -File
        
        foreach ($file in $files) {
            $oldName = $file.Name
            
            # Replace any date pattern (YYYY-MM-DD) with YYYY-08-04
            # Handles patterns like: 2020-08-25, 2021-08-30, etc.
            $newName = $oldName -replace "$year-\d{2}-\d{2}", "$year-08-04"
            
            if ($oldName -ne $newName) {
                $oldPath = $file.FullName
                $newPath = Join-Path $folder $newName
                
                # Check if target file already exists
                if (Test-Path $newPath) {
                    Write-Host "   SKIP: $newName already exists" -ForegroundColor Yellow
                } else {
                    Rename-Item -Path $oldPath -NewName $newName
                    Write-Host "   RENAMED: $oldName -> $newName" -ForegroundColor Green
                }
            }
        }
    } else {
        Write-Host "   Folder not found!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Renaming complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Verify the files look correct"
Write-Host "2. Run notebook 04b to generate new classified maps"
Write-Host "3. Run notebook 06 to export to frontend"
Write-Host "4. Check your webpage!"

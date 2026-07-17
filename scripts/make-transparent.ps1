Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\zeesh\.gemini\antigravity-ide\brain\925cb1ed-a266-4a08-b63b-d936477d7913\seemasarees_logo_temp_1784324883502.png"
$destPath = "c:\Users\zeesh\.gemini\antigravity-ide\scratch\luxury-tailor-web\public\images\seemasarees-logo.png"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source file not found: $srcPath"
    exit 1
}

$bmp = New-Object System.Drawing.Bitmap($srcPath)

# Loop through pixels to convert near-black colors (compression artifacts) to transparent
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Key out any pixel with RGB color values below 18
        if ($c.R -lt 18 -and $c.G -lt 18 -and $c.B -lt 18) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "Successfully generated transparent PNG logo!"

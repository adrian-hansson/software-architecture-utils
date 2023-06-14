Get-ChildItem -Filter "*.mmd" -Recurse | ForEach-Object {
    $Basename = $_.BaseName
    $OutputName = "$Basename.png"
    npx mmdc -i $_.FullName -o "data/output/$OutputName" --scale 2 --cssFile "src\assets\mermaid.css"
}

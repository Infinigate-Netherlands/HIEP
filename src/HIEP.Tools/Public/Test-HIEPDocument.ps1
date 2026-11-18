function Test-HIEPDocument {
    [CmdletBinding()]
    param (
        [Parameter()]
        [string]
        $Path = (Get-Location).Path,

        [Parameter()]
        [switch]
        $PassThru
    )

    $ResolvedPath = Resolve-Path `
        -LiteralPath $Path `
        -ErrorAction Stop

    $Item = Get-Item `
        -LiteralPath $ResolvedPath `
        -ErrorAction Stop

    $RepositoryRoot = Get-HIEPRepositoryRoot -Path $Item.FullName
    $Configuration = Get-HIEPConfiguration -Path $Item.FullName

    $DocumentTypes = @(
        $Configuration.documentation.documentTypes.PSObject.Properties.Name
    )

    $SupportedStatuses = @(
        'Draft',
        'Review',
        'Approved',
        'Deprecated',
        'Archived'
    )

    $SupportedClassifications = @(
        'Public',
        'Internal',
        'Confidential',
        'Restricted'
    )

    $RequiredMetadata = @(
        'id',
        'title',
        'type',
        'version',
        'status',
        'owner',
        'authors',
        'created',
        'updated',
        'classification'
    )

    if ($Item.PSIsContainer) {
        $Files = foreach ($DocumentTypeProperty in $Configuration.documentation.documentTypes.PSObject.Properties) {
            $DocumentDirectory = Join-Path `
                -Path $RepositoryRoot.FullName `
                -ChildPath $DocumentTypeProperty.Value.path

            if (Test-Path -LiteralPath $DocumentDirectory -PathType Container) {
                Get-ChildItem `
                    -LiteralPath $DocumentDirectory `
                    -Filter '*.md' `
                    -File |
                Where-Object {
                    $_.Name -ne 'README.md'
                }
            }
        }

        $Files = @($Files)
    } else {
        $Files = @($Item)
    }

    if ($Files.Count -eq 0) {
        throw 'No managed HIEP document files found.'
    }

    $Documents = foreach ($File in $Files) {
        try {
            $Metadata = Get-HIEPDocumentMetadata -Path $File.FullName
        } catch {
            throw "Unable to read HIEP document '$($File.FullName)': $($_.Exception.Message)"
        }

        foreach ($Field in $RequiredMetadata) {
            $Property = $Metadata.PSObject.Properties[$Field]

            if ($null -eq $Property) {
                throw "HIEP document '$($File.FullName)' is missing required metadata field '$Field'."
            }

            if (
                $Field -notin @('authors') -and
                $null -eq $Property.Value
            ) {
                throw "HIEP document '$($File.FullName)' contains empty required metadata field '$Field'."
            }

            if (
                $Field -notin @('authors') -and
                $Property.Value -is [string] -and
                [string]::IsNullOrWhiteSpace($Property.Value)
            ) {
                throw "HIEP document '$($File.FullName)' contains empty required metadata field '$Field'."
            }
        }

        # Validate the existing document contract before string conversion can
        # hide a list supplied for a scalar, or a scalar supplied for a list.
        foreach ($Field in $RequiredMetadata | Where-Object { $_ -ne 'authors' }) {
            if ($Metadata.PSObject.Properties[$Field].Value -isnot [string]) {
                throw "HIEP metadata field '$Field' must be a scalar string in '$($File.FullName)'."
            }
        }

        foreach ($Field in @('authors', 'reviewers', 'approvers', 'tags')) {
            $Property = $Metadata.PSObject.Properties[$Field]
            if ($null -eq $Property) {
                continue
            }

            if ($Property.Value -isnot [array]) {
                throw "HIEP metadata field '$Field' must be a list in '$($File.FullName)'."
            }

            foreach ($Entry in $Property.Value) {
                if ($Entry -isnot [string] -or [string]::IsNullOrWhiteSpace($Entry)) {
                    throw "HIEP metadata list '$Field' contains an invalid entry in '$($File.FullName)'."
                }
            }
        }

        if ($Metadata.id -notmatch '^HIEP-(BUS|ARC|SEC|VND|GOV|GLS)-[0-9]{3}$') {
            throw "Invalid HIEP document identifier '$($Metadata.id)' in '$($File.FullName)'."
        }

        $NormalizedType = ([string]$Metadata.type).ToUpperInvariant()

        if ($NormalizedType -notin $DocumentTypes) {
            throw "Unsupported HIEP document type '$($Metadata.type)' in '$($File.FullName)'."
        }

        if ($Metadata.id -notmatch '^HIEP-(?<type>[A-Z]{3})-[0-9]{3}$') {
            throw "Unable to determine document type from identifier '$($Metadata.id)' in '$($File.FullName)'."
        }

        $IdType = $Matches.type

        if ($IdType -ne $NormalizedType) {
            throw "Document type '$($Metadata.type)' does not match document identifier '$($Metadata.id)' in '$($File.FullName)'."
        }

        if (
            [string]$Metadata.version -notmatch
            '^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$'
        ) {
            throw "Invalid HIEP document version '$($Metadata.version)' in '$($File.FullName)'."
        }

        if ([string]$Metadata.status -notin $SupportedStatuses) {
            throw "Unsupported lifecycle status '$($Metadata.status)' in '$($File.FullName)'."
        }

        if ([string]$Metadata.classification -notin $SupportedClassifications) {
            throw "Unsupported classification '$($Metadata.classification)' in '$($File.FullName)'."
        }

        $Created = [datetime]::MinValue
        $Updated = [datetime]::MinValue

        if (
            -not [datetime]::TryParseExact(
                [string]$Metadata.created,
                'yyyy-MM-dd',
                [System.Globalization.CultureInfo]::InvariantCulture,
                [System.Globalization.DateTimeStyles]::None,
                [ref]$Created
            )
        ) {
            throw "Invalid created date '$($Metadata.created)' in '$($File.FullName)'. Expected yyyy-MM-dd."
        }

        if (
            -not [datetime]::TryParseExact(
                [string]$Metadata.updated,
                'yyyy-MM-dd',
                [System.Globalization.CultureInfo]::InvariantCulture,
                [System.Globalization.DateTimeStyles]::None,
                [ref]$Updated
            )
        ) {
            throw "Invalid updated date '$($Metadata.updated)' in '$($File.FullName)'. Expected yyyy-MM-dd."
        }

        if ($Updated -lt $Created) {
            throw "Updated date '$($Metadata.updated)' is earlier than created date '$($Metadata.created)' in '$($File.FullName)'."
        }

        $EscapedDocumentId = [regex]::Escape([string]$Metadata.id)

        if ($File.Name -notmatch "^$EscapedDocumentId(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?\.md$") {
            throw "Filename '$($File.Name)' does not contain the correct HIEP document identifier '$($Metadata.id)'."
        }

        $DocumentTypeProperty = $Configuration.documentation.documentTypes.PSObject.Properties |
        Where-Object {
            $_.Name -eq $NormalizedType
        } |
        Select-Object -First 1

        if ($null -eq $DocumentTypeProperty) {
            throw "No repository configuration exists for document type '$NormalizedType'."
        }

        $ExpectedDirectory = Join-Path `
            -Path $RepositoryRoot.FullName `
            -ChildPath $DocumentTypeProperty.Value.path

        $ExpectedDirectory = [System.IO.Path]::GetFullPath($ExpectedDirectory)
        $ActualDirectory = [System.IO.Path]::GetFullPath($File.Directory.FullName)

        if ($ActualDirectory -ne $ExpectedDirectory) {
            throw "HIEP document '$($File.Name)' is in '$ActualDirectory', expected '$ExpectedDirectory' for type '$NormalizedType'."
        }

        [pscustomobject]@{
            Path           = $File.FullName
            Id             = [string]$Metadata.id
            Title          = [string]$Metadata.title
            Type           = $NormalizedType
            Version        = [string]$Metadata.version
            Status         = [string]$Metadata.status
            Classification = [string]$Metadata.classification
            Metadata       = $Metadata
        }
    }

    $DuplicateIds = @(
        $Documents |
        Group-Object -Property Id |
        Where-Object Count -gt 1
    )

    if ($DuplicateIds.Count -gt 0) {
        $Ids = ($DuplicateIds.Name | Sort-Object) -join ', '
        throw "Duplicate HIEP document ID detected: $Ids"
    }

    if ($PassThru) {
        return $Documents
    }

    return $true
}

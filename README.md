# UTM Campaign Link Builder v1.1

This project is a beginner-friendly web app for creating marketing campaign links with UTM parameters.

## Business purpose of UTM parameters

UTM parameters are tags added to a website URL so marketers can see where traffic comes from. When someone clicks a campaign link, the additional tracking information helps answer questions like:

- Which platform sent the visit?
- Was it from email, social media, or paid search?
- Which campaign or ad version performed best?
- Which keyword or content variation drove action?

This helps a business measure campaign performance and improve future marketing decisions.

## Project features

- Validates website URLs before generating a link
- Requires all important campaign fields to be filled in
- Preserves any existing query parameters already present in the original URL
- Uses JavaScript `URL` and `URLSearchParams` to build tracking links correctly
- Encodes parameter values safely
- Displays a clear success or error message
- Lets the user copy the generated link
- Allows the user to reset the form
- Works on desktop and mobile screens
- Uses semantic HTML and accessible labels

## Version 1.1 features

- Saves every successfully generated, unique campaign in browser history
- Shows newest campaigns first in a responsive card layout
- Searches history by campaign name, source, or medium
- Copies or deletes individual saved campaigns
- Exports the complete campaign history as CSV
- Clears all history after confirmation
- Shows clear empty and no-search-results states
- Prevents duplicate records for the same generated URL

## Local storage and privacy

Campaign history is stored in the browser's `localStorage` under the key `utmCampaignHistory`. The data remains available after a refresh, but it is specific to the current browser and site origin. Clearing browser storage removes it.

All campaign data stays locally in the user's browser. This application does not send campaign details to a server, database, analytics service, or external API.

## CSV export

The Export CSV button downloads all saved campaigns, including optional fields and creation timestamps. Every value is wrapped in double quotes, and double quotes inside values are doubled so spreadsheet applications can read commas, quotes, and line breaks correctly. A UTF-8 byte-order mark is included for broad spreadsheet compatibility.

## Technologies used

- HTML for the structure
- CSS for the clean marketing-tool layout
- Vanilla JavaScript for validation and URL generation

## How to run the application

1. Open the project folder in a browser.
2. Double-click `index.html` or use a local static web server.
3. Fill in the required fields.
4. Click the Generate Link button.
5. Copy the result or reset the form when needed.

### Optional local server command

If you want to run it from a local server, you can use:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Current limitations

- This is a front-end-only project without a backend or database.
- History is limited to the current browser and site origin; it does not sync across devices or browsers.
- Browser storage can be cleared by the user or browser settings, so it is not a permanent backup.
- CSV files are exported manually and cannot be imported into the app.
- It does not integrate with analytics tools or external APIs.
- It only validates basic URL format and required fields.

## Future roadmap

- Add a dark mode option
- Add a preview of the campaign parameters before generation
- Add validation rules for campaign naming recommendations
- Add support for more advanced tracking fields
- Add optional CSV import and history backup

## Notes

This project is intentionally simple and designed as a first portfolio project to demonstrate front-end web fundamentals.

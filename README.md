## aniya

CLI Tool for collecting information on GitHub and collecting productivity of development teams.

## Usage

### Install

```bash
# Install
npm install aniya

# Export YOUR_GITHUB_TOKEN
export GITHUB_TOKEN='...'
```

### List PullRequests

List all PullRequests that match the specified condition to standard output; the format option allows you to select the output format (default: CSV).

```bash
npx aniya list --query
```

## Development

```bash
# Copy envfile for debug and set your secrets.
cp .env.sample .env

# Check your execute result.
npm run dev -- list --help
```

...

## License

...

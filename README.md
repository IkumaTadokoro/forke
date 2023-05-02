# Forke

Forke is a simple CLI tool designed to measure development productivity from GitHub info.

## Usage

### Install

```bash
# Install
npm install forke

# Export YOUR_GITHUB_TOKEN
export GITHUB_TOKEN='...'
```

### List PullRequests

List all PullRequests that match the specified condition to standard output; the format option allows you to select the output format (default: CSV).

```bash
npx forke list --query ...
```

### Create Stats

```bash
npx forke stat --query ...
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

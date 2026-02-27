# Letter Opener - Development Email Preview

## Overview

This application uses [Letter Opener](https://github.com/ryanb/letter_opener) and [Letter Opener Web](https://github.com/fgmacedo/letter_opener_web) for development email preview. Instead of sending real emails, all emails are captured and can be viewed in your browser.

## Configuration

- **Delivery Method**: `:letter_opener`
- **Storage Location**: `tmp/letter_opener/`
- **Web Interface**: `http://localhost:3001/letter_opener`

## Setup

The following gems are included in the `Gemfile` (development group):

```ruby
gem "letter_opener", "~> 1.9"
gem "letter_opener_web", "~> 3.0"
```

## Running the Application

### 1. Start the Backend Server (Terminal 1)

```bash
cd wedding-store-backend
bin/rails server -p 3001
```

### 2. Start Sidekiq for Background Jobs (Terminal 2)

**IMPORTANT**: Emails are sent via Sidekiq background jobs. You MUST start Sidekiq to receive emails.

```bash
cd wedding-store-backend
bundle exec sidekiq -C config/sidekiq.yml
```

The `config/sidekiq.yml` configures Sidekiq to process these queues:
- `default` - General background jobs
- `mailers` - Email notifications
- `low_priority` - Non-urgent tasks

### 3. Trigger an Email

Emails are sent automatically for these events:
- **Booking Confirmation** - When a customer creates a new rental booking
- **Delivery Reminder** - 1 day before rental start date
- **Return Reminder** - 1 day before rental end date  
- **Late Notice** - When a rental is overdue

To test manually from Rails console:

```bash
# Start Rails console
bin/rails console

# Send a test email
user = User.first
order = Order.first
UserMailer.booking_confirmation(user, order).deliver_now
```

Or trigger a background job:

```ruby
# This will queue the job in Sidekiq
BookingConfirmationWorker.perform_async(Order.first.id)
```

### 4. View Emails

Open your browser and visit:
```
http://localhost:3001/letter_opener
```

You'll see a list of all sent emails. Click on any email to preview it with full HTML rendering.

## Features

- **Preview HTML emails** - See exactly how emails will look to customers
- **View plain text versions** - Check text-only fallback
- **Inspect email headers** - Verify from, to, subject, etc.
- **Download attachments** - If emails include attachments
- **Clear emails** - Delete all captured emails to start fresh

## Email Templates

Email templates are located in:
```
app/views/user_mailer/
├── booking_confirmation.html.erb
├── delivery_reminder.html.erb
├── return_reminder.html.erb
└── late_notice.html.erb
```

## Production Note

In production, emails are sent via SMTP (configured with SendGrid). Letter Opener is **only** active in the development environment.

## Troubleshooting

### Emails not appearing?

1. Check that `config.action_mailer.delivery_method = :letter_opener` in `config/environments/development.rb`
2. Ensure `config.action_mailer.perform_deliveries = true`
3. Restart the Rails server after configuration changes

### Web interface not loading?

1. Verify the route is mounted: `bin/rails routes | grep letter`
2. Check that you're in development mode: `Rails.env.development?`
3. Clear tmp: `rm -rf tmp/letter_opener/*`

## Alternative: File-Based Viewing

Emails are also saved as HTML files in:
```
tmp/letter_opener/
```

You can open these files directly in your browser if needed.

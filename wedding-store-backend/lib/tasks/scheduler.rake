namespace :scheduler do
  desc "Trigger daily reminders and late return detection"
  task trigger_reminders: :environment do
    puts "Pushing ReminderJob to Sidekiq..."
    ReminderJob.perform_async
    puts "Done."
  end
end

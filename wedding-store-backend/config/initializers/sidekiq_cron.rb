# frozen_string_literal: true

# Sidekiq-cron configuration
# Loads scheduled jobs from config/sidekiq_cron.yml

require 'sidekiq-cron'
require 'yaml'

Rails.application.config.after_initialize do
  # Load cron jobs from YAML configuration
  cron_file = Rails.root.join('config/sidekiq_cron.yml')
  
  if File.exist?(cron_file)
    cron_config = YAML.load_file(cron_file)
    
    cron_config.each do |job_name, job_config|
      Sidekiq::Cron::Job.create(
        name: job_name,
        cron: job_config['cron'],
        class: job_config['class'],
        queue: job_config['queue'],
        description: job_config['description']
      )
    end
    
    Rails.logger.info "[Sidekiq-cron] Loaded #{cron_config.size} scheduled jobs"
  end
end

require 'rspec/core/rake_task'

task :default => :help

desc 'Show help menu'
task :help do
  puts 'Available Rake tasks:'
  puts 'rake spec - Run all specs'
end

desc 'Run specs'
task :spec do
  RSpec::Core::RakeTask.new(:spec) do |t|
    t.rspec_opts = ['--color --format d']
    t.pattern = './spec/**/*_spec.rb'
  end
end


require_relative 'base'
require_relative 'identity'
require_relative 'event'

module Sprtid
	module Models
		class Checkin < Base
			# The Identity being Checked In
			belongs_to :identity, :class_name => 'Sprtid::Models::Identity', :inverse_of => :checkins
#			# The Event to which this Identity is being Checked In
#			belongs_to :user, :class_name => 'Sprtid::Models::User', :inverse_of => :checkins
			# The User who Checked this Identity In
			belongs_to :event, :class_name => 'Sprtid::Models::Event', :inverse_of => :checkins

			# field :event, :type => Event
			field :method, :type => Symbol
			field :device, :type => Symbol

			validates_inclusion_of :method, :in => [:scan, :manual, :directdb]
			validates_inclusion_of :device, :in => [:web, :app, :directdb]
		end
	end
end
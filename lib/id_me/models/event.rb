require_relative 'base'
require_relative 'checkin'
require_relative 'location'
require_relative 'organization'

module Sprtid
	module Models
		class Event < Base
			field :name, :type => String
			field :date, :type => Date
			field :location, :type => Location

			has_many :checkins, :class_name => 'Sprtid::Models::Checkin', :inverse_of => :event
			belongs_to :organization, :class_name => 'Sprtid::Models::Organization', :inverse_of => :events
		end
	end
end
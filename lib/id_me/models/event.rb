require_relative 'base'
require_relative 'checkin'
require_relative 'location'

module Sprtid
	module Models
		class Event < Base
			field :name, :type => String
			field :date, :type => Date
			field :location, :type => Location

			has_many :checkins, :class_name => 'Sprtid::Models::Checkin', :inverse_of => :event
		end
	end
end
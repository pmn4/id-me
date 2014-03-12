require_relative 'cookied_entity'

module Sprtid
	class Event < CookiedEntity
		def initialize(app)
			super(app, 'sprtid_e', 'event_id', Time.new + 2.years.to_i)
		end

		class << self
			def event
				self.entity
			end

			def event!(event)
				self.entity!(event)
			end
		end
	end
end
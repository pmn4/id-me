require_relative 'cookied_entity'

module SprtId
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
require_relative 'cookied_entity'

module Sprtid
	class WhiteLabel < CookiedEntity
		def initialize(app)
			super(app, 'sprtid_wl', 'organization_id', Time.new + 2.years.to_i)
		end

		class << self
			def organization
				self.entity
			end

			def organization!(organization)
				self.entity!(organization)
			end
		end
	end
end

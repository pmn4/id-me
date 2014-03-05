module Sprtid
	module Models
		class AjaxResponse
			attr_accessor :success
			attr_accessor :errors
			attr_accessor :content

			def initialize(attributes = {})
				attributes.each do |k, v|
					key = k.to_s.underscore.to_sym

					instance_variable_set(:"@#{key}", v) unless v.nil?
				end unless attributes.blank?
			end
		end
	end
end
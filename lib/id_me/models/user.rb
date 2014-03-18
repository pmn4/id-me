require_relative 'base'

module Sprtid
	module Models
		class User < Base
			belongs_to :guardian, :class_name => 'Sprtid::Models::User', :inverse_of => :dependants
			has_many :dependants, :class_name => 'Sprtid::Models::User', :inverse_of => :guardian

			has_many :data_bits, :class_name => 'Sprtid::Models::DataBits', :inverse_of => :user

			embeds_many :checkins, :class_name => 'Sprtid::Models::Checkin', :inverse_of => :user
		end

		class DataBits < Base
			# when a User has multiple DataBits of the same type, active indicates which to display
			field :active, :type => Boolean

			field :visibility, :type => Symbol
			validates_inclusion_of :visibility, :in => [:public, :private, :protected]

			belongs_to :user, class_name => 'Sprtid::Models::User', :inverse_of => :data_bits
		end


		#####################
		#                   #
		# Specific DataBits #
		#                   #
		#####################

		class NameDataBit < DataBit
			field :first_name, :type => String
			field :last_name, :type => String

			def initialize(attributes = {})
				@visibility = :public
			end
		end

		class PhotoDataBit < DataBit
			field :photo, :type => IdentityImage

			def initialize(attributes = {})
				@visibility = :protected
			end
		end

		class BirthdayDataBit < DataBit
			field :birthdate, :type => Date

			def age(from = nil)
				return nil if @birthdate.blank?

				from ||= Date.new

				# todo: (@birthday - from).to_years # #orwhatever
				33
			end
		end
	end
end
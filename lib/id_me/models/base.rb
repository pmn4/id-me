module Sprtid
	module Models
		class Base # < ActiveRecord::Base
			include Mongoid::Document
			include Mongoid::Timestamps

			field :version, :type => String, :default => '1.0'
		end
	end
end
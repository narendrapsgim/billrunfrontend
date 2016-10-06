const Templates = {
  Asterisk_CDR: {
    "file_type" : "Asterisk_CDR",
    "parser" : {
      "type" : "separator",
      "separator" : "|",
      "structure" : [
	"accountcode",
	"src",
	"dst",
	"dcontext",
	"clid",
	"channel",
	"dstchannel",
	"lastapp",
	"lastdata",
	"start",
	"answer",
	"end",
	"duration",
	"billsec",
	"disposition",
	"amaflags",
	"userfield",
	"uniqueid"
      ],
      "custom_keys" : [
	"accountcode",
	"src",
	"dst",
	"dcontext",
	"clid",
	"channel",
	"dstchannel",
	"lastapp",
	"lastdata",
	"start",
	"answer",
	"end",
	"duration",
	"billsec",
	"disposition",
	"amaflags",
	"userfield",
	"uniqueid"
      ],
      "line_types" : {
	"H" : "/^none$/",
	"D" : "//",
	"T" : "/^none$/"
      }
    },
    "processor" : {
      "type" : "Usage",
      "date_field" : "answer",
      "volume_field" : "duration",
      "default_usaget" : "call",
      "orphan_files_time" : "6 hours"
    },
    "customer_identification_fields" : [
      {
	"target_key" : "sid",
	"conditions" : [
	  {
	    "field" : "usaget",
	    "regex" : "/.*/"
	  }
	],
	"clear_regex" : "//",
	"src_key" : "src"
      }
    ],
    "rate_calculators" : {
      "call" : [
	{
	  "type" : "longestPrefix",
	  "rate_key" : "params.prefix",
	  "line_key" : "dst"
	}
      ]
    },
    "receiver" : {
      "type" : "ftp",
      "connections" : [
	{
	  "passive" : true,
	  "delete_received" : false,
	  "name" : "Astersik_CDR",
	  "host" : "46.101.149.208",
	  "user" : "ftp_user",
	  "password" : "j8(B2c_sV",
	  "remote_directory" : "/Dori/Asterisk_CDR/"
	}
      ],
      "limit" : 3
    }
  },
  UK_Standard_CDR_v3: {
    "file_type" : "UK_Standard_CDR_v3",
    "parser" : {
      "type" : "separator",
      "separator" : ",",
      "structure" : [
	"call_type",
	"call_cause",
	"customer_identifier",
	"telephone_number_dialled",
	"call_date",
	"call_time",
	"duration",
	"bytes_transmitted",
	"bytes_received",
	"description",
	"chargecode",
	"time_band",
	"salesprice",
	"salesprice__pre_bundle_",
	"extension",
	"ddi",
	"grouping_id",
	"call_class",
	"carrier",
	"recording",
	"vat",
	"country_of_origin",
	"network",
	"retail_tariff_code",
	"remote_network",
	"apn",
	"diverted_number",
	"ring_time",
	"recordid",
	"currency",
	"presentation_number",
	"network_access_reference",
	"ngcs_access_charge",
	"ngcs_service_charge",
	"total_bytes_transferred",
	"user_id",
	"onward_billing_reference",
	"contract_name",
	"bundle_name",
	"bundle_allowance",
	"discount_reference",
	"routing_code"
      ],
      "custom_keys" : [
	"call_type",
	"call_cause",
	"customer_identifier",
	"telephone_number_dialled",
	"call_date",
	"call_time",
	"duration",
	"bytes_transmitted",
	"bytes_received",
	"description",
	"chargecode",
	"time_band",
	"salesprice",
	"salesprice__pre_bundle_",
	"extension",
	"ddi",
	"grouping_id",
	"call_class",
	"carrier",
	"recording",
	"vat",
	"country_of_origin",
	"network",
	"retail_tariff_code",
	"remote_network",
	"apn",
	"diverted_number",
	"ring_time",
	"recordid",
	"currency",
	"presentation_number",
	"network_access_reference",
	"ngcs_access_charge",
	"ngcs_service_charge",
	"total_bytes_transferred",
	"user_id",
	"onward_billing_reference",
	"contract_name",
	"bundle_name",
	"bundle_allowance",
	"discount_reference",
	"routing_code"
      ],
      "line_types" : {
	"H" : "/^none$/",
	"D" : "//",
	"T" : "/^none$/"
      }
    },
    "processor" : {
      "type" : "Usage",
      "date_field" : "call_date",
      "volume_field" : "duration",
      "usaget_mapping" : [
	{
	  "src_field" : "call_type",
	  "pattern" : "/^G$/",
	  "usaget" : "GPRS Data"
	}
      ],
      "orphan_files_time" : "6 hours"
    },
    "customer_identification_fields" : [
      {
	"target_key" : "sid",
	"conditions" : [
	  {
	    "field" : "usaget",
	    "regex" : "/.*/"
	  }
	],
	"clear_regex" : "//",
	"src_key" : "customer_identifier"
      }
    ],
    "rate_calculators" : {
      "GPRS Data" : [
	{
	  "type" : "match",
	  "rate_key" : "key",
	  "line_key" : "apn"
	}
      ]
    },
    "receiver" : {
      "type" : "ftp",
      "connections" : [
	{
	  "passive" : true,
	  "delete_received" : false,
	  "name" : "UK_Standerd_CDR",
	  "host" : "46.101.149.208",
	  "user" : "ftp_user",
	  "password" : "j8(B2c_sV",
	  "remote_directory" : "/Dori/UK_Standard_CDR/"
	}
      ],
      "limit" : 3
    }
  },
  FreeSWITCH_CDR: {
    "file_type" : "FreeSWITCH_CDR",
    "parser" : {
      "type" : "separator",
      "separator" : ",",
      "structure" : [
	"caller_id_name",
	"caller_id_number",
	"destination_number",
	"context",
	"start_stamp",
	"answer_stamp",
	"end_stamp",
	"duration",
	"billsec",
	"hangup_cause",
	"uuid",
	"bleg_uuid",
	"accountcode",
	"read_codec",
	"write_codec"
      ],
      "custom_keys" : [
	"caller_id_name",
	"caller_id_number",
	"destination_number",
	"context",
	"start_stamp",
	"answer_stamp",
	"end_stamp",
	"duration",
	"billsec",
	"hangup_cause",
	"uuid",
	"bleg_uuid",
	"accountcode",
	"read_codec",
	"write_codec"
      ],
      "line_types" : {
	"H" : "/^none$/",
	"D" : "//",
	"T" : "/^none$/"
      }
    },
    "processor" : {
      "type" : "Usage",
      "date_field" : "answer_stamp",
      "volume_field" : "billsec",
      "default_usaget" : "call",
      "orphan_files_time" : "6 hours"
    },
    "customer_identification_fields" : [
      {
	"target_key" : "sid",
	"conditions" : [
	  {
	    "field" : "usaget",
	    "regex" : "/.*/"
	  }
	],
	"clear_regex" : "//",
	"src_key" : "caller_id_number"
      }
    ],
    "rate_calculators" : {
      "call" : [
	{
	  "type" : "longestPrefix",
	  "rate_key" : "params.prefix",
	  "line_key" : "caller_id_number"
	}
      ]
    },
    "receiver" : {
      "type" : "ftp",
      "connections" : [
	{
	  "passive" : true,
	  "delete_received" : false,
	  "name" : "FreeSWITCH_CDR",
	  "host" : "46.101.149.208",
	  "user" : "ftp_user",
	  "password" : "j8(B2c_sV",
	  "remote_directory" : "/Dori/FreeSWITCH_CDR/"
	}
      ],
      "limit" : 3
    }
  }
};

export default Templates;

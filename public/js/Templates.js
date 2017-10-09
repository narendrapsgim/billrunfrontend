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
	    "regex" : "/^call$/"
	  }
	],
	"clear_regex" : "//",
	"src_key" : "src"
      }
    ],
    "rate_calculators" : {
      "retail": {
        "call" : [[
  	{
  	  "type" : "longestPrefix",
  	  "rate_key" : "params.prefix",
  	  "line_key" : "dst"
  	}
  ]]
      }
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
	    "regex" : "/^GPRS Data$/"
	  }
	],
	"clear_regex" : "//",
	"src_key" : "customer_identifier"
      }
    ],
    "rate_calculators" : {
      "retail": {
        "GPRS Data" : [[
  	{
  	  "type" : "match",
  	  "rate_key" : "key",
  	  "line_key" : "apn"
  	}
      ]]
      }
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
	    "regex" : "/^call$/"
	  }
	],
	"clear_regex" : "//",
	"src_key" : "caller_id_number"
      }
    ],
    "rate_calculators" : {
      "retail": {
        "call" : [[
  	{
  	  "type" : "longestPrefix",
  	  "rate_key" : "params.prefix",
  	  "line_key" : "caller_id_number"
  	}
      ]]
      }
    }
  },
  Cisco_CDR: {
    "file_type" : "Cisco_CDR",
    "parser" : {
      "type" : "separator",
      "separator" : ",",
      "structure" : [
	"cdrrecordtype",
	"globalcallid_callmanagerid",
	"globalcallid_callid",
	"origlegcallidentifier",
	"datetimeorigination",
	"orignodeid",
	"origspan",
	"origipaddr",
	"callingpartynumber",
	"callingpartyunicodeloginuserid",
	"origcause_location",
	"origcause_value",
	"origprecedencelevel",
	"origmediatransportaddress_ip",
	"origmediatransportaddress_port",
	"origmediacap_payloadcapability",
	"origmediacap_maxframesperpacket",
	"origmediacap_g723bitrate",
	"origvideocap_codec",
	"origvideocap_bandwidth",
	"origvideocap_resolution",
	"origvideotransportaddress_ip",
	"origvideotransportaddress_port",
	"origrsvpaudiostat",
	"origrsvpvideostat",
	"destlegcallidentifier",
	"destnodeid",
	"destspan",
	"destipaddr",
	"originalcalledpartynumber",
	"finalcalledpartynumber",
	"finalcalledpartyunicodeloginuserid",
	"destcause_location",
	"destcause_value",
	"destprecedencelevel",
	"destmediatransportaddress_ip",
	"destmediatransportaddress_port",
	"destmediacap_payloadcapability",
	"destmediacap_maxframesperpacket",
	"destmediacap_g723bitrate",
	"destvideocap_codec",
	"destvideocap_bandwidth",
	"destvideocap_resolution",
	"destvideotransportaddress_ip",
	"destvideotransportaddress_port",
	"destrsvpaudiostat",
	"destrsvpvideostat",
	"datetimeconnect",
	"datetimedisconnect",
	"lastredirectdn",
	"pkid",
	"originalcalledpartynumberpartition",
	"callingpartynumberpartition",
	"finalcalledpartynumberpartition",
	"lastredirectdnpartition",
	"duration",
	"origdevicename",
	"destdevicename",
	"origcallterminationonbehalfof",
	"destcallterminationonbehalfof",
	"origcalledpartyredirectonbehalfof",
	"lastredirectredirectonbehalfof",
	"origcalledpartyredirectreason",
	"lastredirectredirectreason",
	"destconversationid",
	"globalcallid_clusterid",
	"joinonbehalfof",
	"comment",
	"authcodedescription",
	"authorizationlevel",
	"clientmattercode",
	"origdtmfmethod",
	"destdtmfmethod",
	"callsecuredstatus",
	"origconversationid",
	"origmediacap_bandwidth",
	"destmediacap_bandwidth",
	"authorizationcodevalue",
	"outpulsedcallingpartynumber",
	"outpulsedcalledpartynumber",
	"origipv4v6addr",
	"destipv4v6addr",
	"origvideocap_codec_channel2",
	"origvideocap_bandwidth_channel2",
	"origvideocap_resolution_channel2",
	"origvideotransportaddress_ip_channel2",
	"origvideotransportaddress_port_channel2",
	"origvideochannel_role_channel2",
	"destvideocap_codec_channel2",
	"destvideocap_bandwidth_channel2",
	"destvideocap_resolution_channel2",
	"destvideotransportaddress_ip_channel2",
	"destvideotransportaddress_port_channel2",
	"destvideochannel_role_channel2",
	"incomingprotocolid",
	"incomingprotocolcallref",
	"outgoingprotocolid",
	"outgoingprotocolcallref",
	"currentroutingreason",
	"origroutingreason",
	"lastredirectingroutingreason",
	"huntpilotdn",
	"huntpilotpartition",
	"calledpartypatternusage"
      ],
      "custom_keys" : [
	"cdrrecordtype",
	"globalcallid_callmanagerid",
	"globalcallid_callid",
	"origlegcallidentifier",
	"datetimeorigination",
	"orignodeid",
	"origspan",
	"origipaddr",
	"callingpartynumber",
	"callingpartyunicodeloginuserid",
	"origcause_location",
	"origcause_value",
	"origprecedencelevel",
	"origmediatransportaddress_ip",
	"origmediatransportaddress_port",
	"origmediacap_payloadcapability",
	"origmediacap_maxframesperpacket",
	"origmediacap_g723bitrate",
	"origvideocap_codec",
	"origvideocap_bandwidth",
	"origvideocap_resolution",
	"origvideotransportaddress_ip",
	"origvideotransportaddress_port",
	"origrsvpaudiostat",
	"origrsvpvideostat",
	"destlegcallidentifier",
	"destnodeid",
	"destspan",
	"destipaddr",
	"originalcalledpartynumber",
	"finalcalledpartynumber",
	"finalcalledpartyunicodeloginuserid",
	"destcause_location",
	"destcause_value",
	"destprecedencelevel",
	"destmediatransportaddress_ip",
	"destmediatransportaddress_port",
	"destmediacap_payloadcapability",
	"destmediacap_maxframesperpacket",
	"destmediacap_g723bitrate",
	"destvideocap_codec",
	"destvideocap_bandwidth",
	"destvideocap_resolution",
	"destvideotransportaddress_ip",
	"destvideotransportaddress_port",
	"destrsvpaudiostat",
	"destrsvpvideostat",
	"datetimeconnect",
	"datetimedisconnect",
	"lastredirectdn",
	"pkid",
	"originalcalledpartynumberpartition",
	"callingpartynumberpartition",
	"finalcalledpartynumberpartition",
	"lastredirectdnpartition",
	"duration",
	"origdevicename",
	"destdevicename",
	"origcallterminationonbehalfof",
	"destcallterminationonbehalfof",
	"origcalledpartyredirectonbehalfof",
	"lastredirectredirectonbehalfof",
	"origcalledpartyredirectreason",
	"lastredirectredirectreason",
	"destconversationid",
	"globalcallid_clusterid",
	"joinonbehalfof",
	"comment",
	"authcodedescription",
	"authorizationlevel",
	"clientmattercode",
	"origdtmfmethod",
	"destdtmfmethod",
	"callsecuredstatus",
	"origconversationid",
	"origmediacap_bandwidth",
	"destmediacap_bandwidth",
	"authorizationcodevalue",
	"outpulsedcallingpartynumber",
	"outpulsedcalledpartynumber",
	"origipv4v6addr",
	"destipv4v6addr",
	"origvideocap_codec_channel2",
	"origvideocap_bandwidth_channel2",
	"origvideocap_resolution_channel2",
	"origvideotransportaddress_ip_channel2",
	"origvideotransportaddress_port_channel2",
	"origvideochannel_role_channel2",
	"destvideocap_codec_channel2",
	"destvideocap_bandwidth_channel2",
	"destvideocap_resolution_channel2",
	"destvideotransportaddress_ip_channel2",
	"destvideotransportaddress_port_channel2",
	"destvideochannel_role_channel2",
	"incomingprotocolid",
	"incomingprotocolcallref",
	"outgoingprotocolid",
	"outgoingprotocolcallref",
	"currentroutingreason",
	"origroutingreason",
	"lastredirectingroutingreason",
	"huntpilotdn",
	"huntpilotpartition",
	"calledpartypatternusage"
      ],
      "line_types" : {
	"H" : "/^none$/",
	"D" : "//",
	"T" : "/^none$/"
      }
    },
    "processor" : {
      "type" : "Usage",
      "date_field" : "datetimeconnect",
      "volume_field" : "duration",
      "usaget_mapping" : [
	{
	  "src_field" : "calledpartypatternusage",
	  "pattern" : "/^NA$/",
	  "usaget" : "NA"
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
	    "regex" : "/^NA$/"
	  }
	],
	"clear_regex" : "//",
	"src_key" : "callingpartynumber"
      }
    ],
    "rate_calculators" : {
      "retail": {
        "NA" : [[
  	{
  	  "type" : "longestPrefix",
  	  "rate_key" : "params.prefix",
  	  "line_key" : "originalcalledpartynumber"
  	}
      ]]
      }
    }
  }
};

export default Templates;

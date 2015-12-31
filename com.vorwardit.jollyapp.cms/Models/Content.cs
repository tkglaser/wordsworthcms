using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace com.vorwardit.jollyapp.cms.Models
{
    public class Content
    {
        public long ContentId { get; set; }

        public Guid SiteId { get; set; }
        [ForeignKey("SiteId")]
        public Site Site { get; set; }

        [MaxLength(1024)]
        public string Url { get; set; }

        public string Body { get; set; }
    }
}
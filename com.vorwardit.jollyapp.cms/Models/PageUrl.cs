using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace com.vorwardit.jollyapp.cms.Models
{
    public class PageUrl
    {
        public long PageUrlId { get; set; }

        public Guid PageId { get; set; }
        [ForeignKey("PageId")]
        public Page Page { get; set; }

        [MaxLength(1024)]
        public string Url { get; set; }
    }
}
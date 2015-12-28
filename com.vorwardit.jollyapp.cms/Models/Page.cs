﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace com.vorwardit.jollyapp.cms.Models
{
    public class Page
    {
        public Guid PageId { get; set; }

        public Guid SiteId { get; set; }
        [ForeignKey("SiteId")]
        public Site Site { get; set; }

        public Guid PageLayoutId { get; set; }
        [ForeignKey("PageLayoutId")]
        public PageLayout PageLayout { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        public virtual ICollection<PageVersion> Versions { get; set; }
    }
}
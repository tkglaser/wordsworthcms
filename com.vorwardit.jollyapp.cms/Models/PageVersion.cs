using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace com.vorwardit.jollyapp.cms.Models
{
    public enum PageVersionStatus
    {
        Draft = 0,
        Published = 1
    }

    public class PageVersion
    {
        public Guid PageVersionId { get; set; }

        public Guid PageId { get; set; }

        [ForeignKey("PageId")]
        public Page Page { get; set; }

        [MaxLength(1024)]
        public string Title { get; set; }

        [MaxLength(4096)]
        public string MetaDescription { get; set; }

        public int RevisionNumber { get; set; }

        public PageVersionStatus Status { get; set; }

        public string Body { get; set; }
    }
}
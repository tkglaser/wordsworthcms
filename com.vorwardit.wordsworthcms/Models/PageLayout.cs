using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms.Models
{
    public class PageLayout
    {
        public Guid PageLayoutId { get; set; }

        public Guid LayoutId { get; set; }

        [ForeignKey("LayoutId")]
        public Layout Layout { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        public string Body { get; set; }
    }
}
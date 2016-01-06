using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms.Models
{
    public class Layout
    {
        public Guid LayoutId { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        public string Body { get; set; }
    }
}
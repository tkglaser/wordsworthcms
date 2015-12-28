using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace com.vorwardit.jollyapp.cms.Models
{
    public class Site
    {
        public Guid SiteId { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        [Column("Bindings")]
        public string BindingsData { get; set; }

        [NotMapped]
        public string[] Bindings
        {
            get
            {
                return new JavaScriptSerializer().Deserialize<string[]>(BindingsData ?? "");
            }
            set
            {
                BindingsData = new JavaScriptSerializer().Serialize(value);
            }
        }
    }
}
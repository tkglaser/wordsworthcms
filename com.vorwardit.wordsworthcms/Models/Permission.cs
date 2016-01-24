using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms.Models
{
    public enum PermissionType
    {
        Admin = 0,
        Designer = 1,
        ContentEditor = 2
    }

    public class Permission
    {
        public long PermissionId { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        public PermissionType Type { get; set; }

        [ForeignKey("Site")]
        public Guid? SiteId { get; set; }
        public Site Site { get; set; }
    }
}
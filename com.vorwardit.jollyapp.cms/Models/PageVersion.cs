using Newtonsoft.Json;
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

    public class PageModule<T>
    {
        public string Position { get; set; }
        public string Type { get; set; }
        public T Data { get; set; }
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

        [NotMapped]
        public List<PageModule<dynamic>> ModuleData
        {
            get
            {
                try
                {
                    return JsonConvert.DeserializeObject<List<PageModule<dynamic>>>(Body);
                }
                catch
                {
                    return new List<PageModule<dynamic>>();
                }
            }
            set
            {
                Body = JsonConvert.SerializeObject(value);
            }
        }

		public PageModule<dynamic> GetModule(string position)
		{
			var md = ModuleData;
			var result = md.FirstOrDefault(d => d.Position == position);
			if (result == null)
			{
				result = new PageModule<dynamic>
				{
					Position = position,
					Type = "content"
				};
				md.Add(result);
				ModuleData = md;
			}
			return result;
		}

		public void SetModule(string position, PageModule<dynamic> module)
		{
			var md = ModuleData.Where(d => d.Position != position).ToList();
			md.Add(module);
			ModuleData = md;
		}
	}
}
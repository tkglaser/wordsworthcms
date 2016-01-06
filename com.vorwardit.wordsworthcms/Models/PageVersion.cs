using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms.Models
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
        public List<PageModule<Dictionary<string, string>>> ModuleData
        {
            get
            {
                try
                {
                    return JsonConvert.DeserializeObject<List<PageModule<Dictionary<string, string>>>>(Body);
                }
                catch
                {
                    return new List<PageModule<Dictionary<string, string>>>();
                }
            }
            set
            {
                Body = JsonConvert.SerializeObject(value);
            }
        }

		public PageModule<Dictionary<string, string>> GetModule(string position)
		{
			var md = ModuleData;
			var result = md.FirstOrDefault(d => d.Position == position);
			if (result == null)
			{
				result = new PageModule<Dictionary<string, string>>
				{
					Position = position,
					Type = "content"
				};
				md.Add(result);
				ModuleData = md;
			}
			return result;
		}

		public PageModule<T> GetModule<T>(string position)
		{
			var md = ModuleData;
			var result = md.FirstOrDefault(d => d.Position == position);
			if (result == null)
			{
				result = new PageModule<Dictionary<string, string>>
				{
					Position = position,
					Type = "content"
				};
				md.Add(result);
				ModuleData = md;
			}

			var typedResult = Activator.CreateInstance<PageModule<T>>();
			typedResult.Position = position;
			typedResult.Type = result.Type;
			typedResult.Data = Activator.CreateInstance<T>();

			foreach(var p in typeof(T).GetProperties())
			{
				if (result.Data.ContainsKey(p.Name))
				{
					p.SetValue(typedResult.Data, result.Data[p.Name]);
				}
			}

			return typedResult;
		}

		public void SetModule(string position, PageModule<Dictionary<string, string>> module)
		{
			var md = ModuleData.Where(d => d.Position != position).ToList();
			md.Add(module);
			ModuleData = md;
		}

		public void SetModule<T>(string position, PageModule<T> module)
		{
			var untypedModule = new PageModule<Dictionary<string, string>>();
			untypedModule.Position = position;
			untypedModule.Type = module.Type;
			untypedModule.Data = new Dictionary<string, string>();
			foreach (var p in typeof(T).GetProperties())
			{
				untypedModule.Data[p.Name] = p.GetValue(module.Data).ToString();
			}
			var md = ModuleData.Where(d => d.Position != position).ToList();
			md.Add(untypedModule);
			ModuleData = md;
		}
	}
}
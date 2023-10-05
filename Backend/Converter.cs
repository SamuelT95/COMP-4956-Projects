using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Backend
{
    public class JsonToPython
    {
        public void LoadJson()
        {
            using (StreamReader r = new StreamReader("./CodeSchemas/Schema1.json"))
            {
                string json = r.ReadToEnd();
                dynamic schema = JsonConvert.DeserializeObject(json)!;
                int i = 0;
                int j = 0;
                foreach (var item in schema)
                {
                    foreach (var item2 in item)
                    {
                        
                        try
                        {
                            Console.WriteLine(item2.Name);
                        }
                        catch (Exception e)
                        {
                            //Console.WriteLine(e);
                        }

                        try
                        {
                            Console.WriteLine(item2.Code);
                        }
                        catch (Exception e)
                        {
                            //Console.WriteLine(e);
                        }

                        try
                        {
                            Console.WriteLine(item2.Body);
                        }
                        catch (Exception e)
                        {
                            //Console.WriteLine(e);
                        }
                        Console.WriteLine("J " + j++);
                    }
                    Console.WriteLine("I " + i++);
                }
            }
        }
    }
}
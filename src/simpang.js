const PERSIMPANGAN = [
    { id: "itc-28", vertexType: 'intersection', latitude: -7.783281838853151, longitude: 110.41049480438234, label: 'Simpang Tiga Janti', neighborIds: ['itc-29', 'itc-50', 'itc-93'] },
    { id: "itc-32", vertexType: 'intersection', latitude: -7.783111758889569, longitude: 110.38772821426393, label: 'Jalan Urip Sumoharjo', neighborIds: ['itc-42', 'itc-43', 'itc-198', 'itc-261'] },
    { id: "itc-36", vertexType: 'intersection', latitude: -7.783008116377931, longitude: 110.37750095129016, label: 'Jalan Jenderal Sudirman', neighborIds: ['itc-46', 'itc-43'] },
    { id: "itc-43", vertexType: 'intersection', latitude: -7.783069238887897, longitude: 110.37923097610474, label: 'Jalan Anggrek', neighborIds: ['itc-270', 'itc-36', 'itc-32', 'itc-44'] },
    { id: "itc-46", vertexType: 'intersection', latitude: -7.782941678857006, longitude: 110.37485361099245, label: 'Jalan Merbabu', neighborIds: ['itc-112', 'itc-36', 'itc-47', 'itc-113'] },
    { id: "itc-47", vertexType: 'intersection', latitude: -7.784684995919323, longitude: 110.37468194961548, label: 'Jalan Slamet Riyadi', neighborIds: ['itc-46', 'itc-48', 'itc-201'] },
    { id: "itc-48", vertexType: 'intersection', latitude: -7.785896809605072, longitude: 110.37451028823854, label: 'Jalan Dr. Sutomo', neighborIds: ['itc-47', 'itc-216', "rs-dr-soetarto", 'itc-239'] },
    { id: "itc-50", vertexType: 'intersection', latitude: -7.783239318868718, longitude: 110.4083275794983, label: 'Jalan Sisingamangaraja', neighborIds: ['itc-28', 'itc-59', 'itc-92'] },
    { id: "itc-51", vertexType: 'intersection', latitude: -7.797260049816141, longitude: 110.37766993045808, label: 'Jalan Gadjah Mada', neighborIds: ['itc-108', 'itc-56', 'itc-99', 'itc-269'] },
    { id: "itc-52", vertexType: 'intersection', latitude: -7.788533023763781, longitude: 110.37395238876343, label: 'Jalan Sultan Agung', neighborIds: ['itc-53', 'itc-214', 'itc-217'] },
    { id: "itc-53", vertexType: 'intersection', latitude: -7.790417162628816, longitude: 110.37296265363696, label: 'Jalan Parangtritis', neighborIds: ['itc-54', 'itc-52'] },
    { id: "itc-54", vertexType: 'intersection', latitude: -7.790496886230279, longitude: 110.37409991025926, label: 'Jalan Irian', neighborIds: ['itc-241', 'itc-53', 'itc-56'] },
    { id: "itc-55", vertexType: 'intersection', latitude: -7.794698298547981, longitude: 110.36889910697938, label: 'Jalan Sumatra', neighborIds: ['itc-61', 'itc-242', 'itc-243'] },
    { id: "itc-56", vertexType: 'intersection', latitude: -7.789999942200338, longitude: 110.37820369005205, label: 'Jalan Java', neighborIds: ['itc-51', 'itc-54','itc-270','itc-262'] },
    { id: "itc-58", vertexType: 'intersection', latitude: -7.798570150990592, longitude: 110.40987253189088, label: 'Jalan Sumatra', neighborIds: ['itc-200', 'itc-62', 'itc-93', 'itc-146']},
    { id: "itc-59", vertexType: 'intersection', latitude: -7.783281838853151, longitude: 110.3950881958008, label: 'Jalan Laksda Adisucipto', neighborIds: ['itc-50', 'itc-60', 'itc-91'] },
    { id: "itc-60", vertexType: 'intersection', latitude: -7.792551092460299, longitude: 110.3930711746216, label: 'Jalan Yos Sudarso', neighborIds: ['itc-59', 'itc-100', 'itc-199'] },
    { id: "itc-61", vertexType: 'intersection', latitude: -7.796675419165053, longitude: 110.36911368370056, label: 'Jalan Kusumanegara', neighborIds: ['itc-55', 'itc-83', 'itc-108'] },
    { id: "itc-62", vertexType: 'intersection', latitude: -7.798663160045796, longitude: 110.40234088897706, label: 'Jalan Slamet Riyadi', neighborIds: ['itc-63', 'itc-58'] },
    { id: "itc-63", vertexType: 'intersection', latitude: -7.802298469201737, longitude: 110.40223360061646, label: 'Jalan Gajah Mada', neighborIds: ['itc-62', 'itc-69'] },
    { id: "itc-64", vertexType: 'intersection', latitude: -7.810685070616185, longitude: 110.40216922760011, label: 'Jalan Diponegoro', neighborIds: ['itc-63', 'itc-65', 'itc-146', 'itc-264'] },
    { id: "itc-65", vertexType: 'intersection', latitude: -7.810578777608362, longitude: 110.39637565612794, label: 'Jalan Jenderal Soedirman', neighborIds: ['itc-66', 'itc-64'] },
    { id: "itc-66", vertexType: 'intersection', latitude: -7.813331757787917, longitude: 110.39612352848053, label: 'Jalan Dr. Wahidin', neighborIds: ['itc-72', 'itc-65'] },
    { id: "itc-67", vertexType: 'intersection', latitude: -7.816828760491538, longitude: 110.3839945793152, label: 'Jalan Sultan Agung', neighborIds: ['itc-102', 'itc-68', 'itc-207', 'itc-263'] },
    { id: "itc-68", vertexType: 'intersection', latitude: -7.816435482014306, longitude: 110.38142502307893, label: 'Jalan Sunan Kalijaga', neighborIds: ['rs-bhakti-ibu', 'itc-89'] },
    { id: "itc-69", vertexType: 'intersection', latitude: -7.802117767446177, longitude: 110.39521694183351, label: 'Jalan Soekarno-Hatta', neighborIds: ['itc-70', 'itc-63', 'itc-72'] },
    { id: "itc-70", vertexType: 'intersection', latitude: -7.802011472259368, longitude: 110.38910150527956, label: 'Jalan Gadjah Mada', neighborIds: ['itc-69', 'itc-209'] },
    { id: "itc-71", vertexType: 'intersection', latitude: -7.811535413704974, longitude: 110.38699865341188, label: 'Jalan Urip Sumoharjo', neighborIds: ['itc-70', "rs-hidayatullah", 'itc-71'] },
    { id: "itc-72", vertexType: 'intersection', latitude: -7.814410623448759, longitude: 110.39205193519594, label: 'Jalan Urip Sumoharjo', neighborIds: ["itc-205", 'itc-66', 'itc-69'] },
    { id: "itc-73", vertexType: 'intersection', latitude: -7.815330048634235, longitude: 110.3731155395508, label: 'Jalan Laksda Adisucipto', neighborIds: ['itc-103', 'itc-106', 'itc-75']},
    { id: "itc-75", vertexType: 'intersection', latitude: -7.814681668078089, longitude: 110.36845922470094, label: 'Jalan Sunan Kalijaga', neighborIds: ['itc-76', 'itc-73', 'itc-80', 'itc-211'] },
    { id: "itc-80", vertexType: 'intersection', latitude: -7.813044768423498, longitude: 110.35603523254396, label: 'Jalan Jenderal Soedirman', neighborIds: ['itc-79', 'itc-81', 'itc-75'] },
    { id: "itc-81", vertexType: 'intersection', latitude: -7.811896808993447, longitude: 110.3494691848755, label: 'Jalan Parangtritis', neighborIds: ['itc-80', 'itc-85', 'itc-163']},
    {id: "itc-89", vertexType: 'intersection', latitude: -7.815702069810121, longitude: 110.37619471549989, label: 'Jalan Menteri Supeno', neighborIds:['itc-68', 'itc-103', 'itc-269']},
    {id: 'itc-91', vertexType: 'intersection', latitude: -7.783133018888789, longitude: 110.39103806018831, label: 'Jalan Laskda Adisucipto', neighborIds: ['itc-198', 'itc-59', 'rs-siloam-yogyakarta']},
    {id: 'itc-93', vertexType: 'intersection', latitude: -7.797026197653721, longitude: 110.40993690490723, label: 'Jalan Majapahit', neighborIds: ['rs-drs-hardjolukito', 'itc-58', 'itc-28']},
    {id: 'itc-97', vertexType: 'intersection', latitude: -7.800427670775402, longitude: 110.39535641670228, label: 'Jalan Kenari', neighborIds: ['itc-69', 'itc-98']},
    {id: 'itc-98', vertexType: 'intersection', latitude: -7.79957730508792, longitude: 110.39225578308107, label: 'Jalan Kenari', neighborIds: ['itc-97', 'itc-99', 'itc-100']},
    {id: 'itc-99', vertexType: 'intersection', latitude: -7.797610827814685, longitude: 110.38491725921632, label: 'Jalan Kenari', neighborIds: ['itc-51', 'itc-98', 'itc-262']},
    {id: 'itc-100', vertexType: 'intersection', latitude: -7.794049885989234, longitude: 110.39295315742494, label: 'Jalan Ipda Tut Harsono', neighborIds: ['itc-60', 'itc-98', 'rs-happy-land']},
    {id: 'itc-101', vertexType: 'intersection', latitude: -7.815606407253706, longitude: 110.38762092590333, label: 'Jalan Veteran', neighborIds: ['itc-205', 'itc-102', 'rs-hidayatullah']},
    {id: 'itc-102', vertexType: 'intersection', latitude: -7.816010315676117, longitude: 110.3864622116089, label: 'Jalan veteran', neighborIds: ['itc-71', 'itc-101']},
    {id: 'itc-103', vertexType: 'intersection', latitude: -7.815330048634235, longitude: 110.37361979484558, label: 'Jalan Kolonel Sugiono', neighborIds: ['itc-89', 'rs-pratama']},
    {id: 'itc-106', vertexType: 'intersection', latitude: -7.815946540688034, longitude: 110.37316381931306, label: 'Jalan Sisingramangaraja', neighborIds: ['itc-73', 'itc-105']},
    {id: 'itc-107', vertexType: 'intersection', latitude: -7.808405079666344, longitude: 110.3691351413727, label: 'Jalan Brigadir Jenderal Katomso', neighborIds: ['itc-211', 'itc-83', 'rs-tht-dr-pomo']},
    {id: 'itc-108', vertexType: 'intersection', latitude: -7.796813604665394, longitude: 110.37263810634614, label: 'Jalan Juminahan', neighborIds: ['rs-lempuyangwangi', 'itc-61', 'itc-203', 'itc-268']},
    {id: 'itc-112', vertexType: 'intersection', latitude: -7.782941678857006, longitude: 110.37232160568239, label: 'Jalan Cornelis Simanjuntak', neighborIds: ['itc-45', 'itc-46', 'itc-219']},
    {id: 'itc-145', vertexType: 'intersection', latitude: -7.782867268821041, longitude: 110.36703228950502, label: 'Jalan Diponegoro', neighborIds: ['itc-144', 'itc-112', 'itc-172', 'itc-250']},
    {id: 'itc-146', vertexType: 'intersection', latitude: -7.811833033377027, longitude: 110.40901422500612, label: 'Jalan Majapahit', neighborIds: ['itc-64', 'itc-58', 'itc-147']},
    {id: 'itc-162', vertexType: 'intersection', latitude: -7.801012296182646, longitude: 110.35178661346437, label: 'Jalan Wates', neighborIds: ['itc-161', 'itc-163', 'itc-169']}, 
    {id: 'itc-163', vertexType: 'intersection', latitude: -7.807772632419869, longitude: 110.35033822059633, label:'Jalan Patangpuluhan', neighborIds:['itc-162', 'itc-81']},
    {id: 'itc-198', vertexType: 'intersection', latitude: -7.7831356763886195, longitude: 110.39060622453692, label: 'Jalan Laksda Adisucipto', neighborIds: ['itc-91', 'rs-siloam-yogyakarta', 'itc-32']},
    {id: 'itc-199', vertexType: 'intersection', latitude: -7.792503258535914, longitude: 110.39205729961397, label: 'Jalan Melati Wetan', neighborIds: ['itc-60', 'itc-262', 'rs-happy-land']}, 
    {id: 'itc-200', vertexType: 'intersection', latitude: -7.798556863981014, longitude: 110.41154086589815, label: 'Jalan Maguwo - Blok o', neighborIds: ['rs-drs-hardjolukito', 'itc-58']},
    {id: 'itc-201', vertexType: 'intersection', latitude: -7.7848683626888775, longitude: 110.3761973977089, label: 'Jalan Suhartono', neighborIds: ['rs-dr-soetarto', 'itc-47', 'itc-202']}, 
    {id: 'itc-202', vertexType: 'intersection', latitude: -7.784158812569983, longitude: 110.37675261497498, label: 'Jalan Suhartono', neighborIds: ['rs-bethesda', 'itc-201']},
    {id: 'itc-203', vertexType: 'intersection', latitude: -7.79619974180538, longitude: 110.37268102169038, label: 'Jalan Hayam Wuruk', neighborIds: ['rs-lempuyangwangi', 'itc-108']},
    {id: 'itc-205', vertexType: 'intersection', latitude: -7.815428959433617, longitude: 110.38827002048494, label: 'Kalan Veteran', neighborIds: ['rs-hidayatullah', 'itc-101', 'itc-72']},
    {id: 'itc-206', vertexType: 'intersection', latitude: -7.8129487654007646, longitude: 110.38153767585756, label: 'Jalan Golo', neighborIds: ['rs-bhakti-ibu', 'itc-207']},
    {id: 'itc-207', vertexType: 'intersection', latitude: -7.8122397006027215, longitude: 110.38283050060274, label: 'Jalan Tohpati', neighborIds: ['itc-206', 'itc-67', 'itc-208']},
    {id: 'itc-210', vertexType: 'intersection', latitude: -7.809134214747651, longitude: 110.36865234375001, label: 'Jalan Madyosuro', neighborIds: ['rs-tht-dr-pomo', 'itc-211']}, 
    {id: 'itc-211', vertexType: 'intersection', latitude: -7.809165433340936, longitude: 110.36907076835632, label: 'Jalan mantrigawen Lor', neighborIds: ['itc-210', 'itc-107']},
    {id: 'itc-215', vertexType: 'intersection', latitude: -7.787959010803244, longitude: 110.37227869033815, label: 'Jalan Abu Bakar Ali', neighborIds: ['itc-214', 'itc-240', 'itc-231']},
    {id: 'itc-216', vertexType: 'intersection', latitude: -7.786810982522671, longitude: 110.37431180477144, label: 'Jalan Yos Sudarso', neighborIds: ['itc-48', 'itc-214', 'itc-217']}, 
    {id: 'itc-217', vertexType: 'intersection', latitude: -7.788261962185988, longitude: 110.37500917911531, label: 'Jalan Yos Sudarso', neighborIds: ['itc-216', 'itc-52']},
    {id: 'itc-218', vertexType: 'intersection', latitude: -7.784227907390899, longitude: 110.37125945091249, label: 'Jalan Faridan Muridan Noto', neighborIds: ['itc-232', 'itc-219', 'itc-230']}, 
    {id: 'itc-219', vertexType: 'intersection', latitude: -7.782925724671548, longitude: 110.37143648957438, label: 'Jalan Jenderal Sudirman', neighborIds: ['itc-145', 'itc-218', 'itc-112', 'itc-270']},
    {id: 'itc-230', vertexType: 'intersection', latitude: -7.78567358103153, longitude: 110.36949992179872, label: 'Jalan Nyoman Oka', neighborIds: ['itc-233', 'itc-235', 'itc-218']}, 
    {id: 'itc-231', vertexType: 'intersection', latitude: -7.788256647251349, longitude: 110.3716027736664, label: 'Jalan Nyoman  Oka', neighborIds: ['itc-236', 'itc-215', 'itc-238']},
    {id: 'itc-232', vertexType: 'intersection', latitude: -7.785216493581325, longitude: 110.37168323993683, label: 'Jalan Faridan Muridan Noto', neighborIds: ['itc-239', 'itc-218']},
    {id: 'itc-233', vertexType: 'intersection', latitude: -7.787082045039288, longitude: 110.36853969097137, label: 'Jalan Ahmad Jajuli', neighborIds: ['itc-230', 'itc-234']},
    {id: 'itc-234', vertexType: 'intersection', latitude: -7.7877251534456935, longitude: 110.36868989467622, label: 'Jalan Nyoman Oka', neighborIds: ['itc-233', 'itc-235']},
    {id: 'itc-235', vertexType: 'intersection', latitude: -7.786911966617982, longitude: 110.36973595619203, label: 'Jalan Lawu', neighborIds: ['itc-230', 'itc-234', 'itc-239']},
    {id: 'itc-236', vertexType: 'intersection', latitude: -7.787576335059267, longitude: 110.37020802497865, label: 'Jalan Nyoman Oka', neighborIds: ['itc-235', 'itc-231', 'itc-237', 'itc-240']},
    {id: 'itc-237', vertexType: 'intersection', latitude: -7.788493161778056, longitude: 110.36897152662279, label: 'Jalan Ahmad Jajuli', neighborIds: ['itc-234', 'itc-236', 'itc-238']},
    {id: 'itc-238', vertexType: 'intersection', latitude: -7.78949768266186, longitude: 110.36979496479036, label: 'Jalan Ahmad Jajuli', neighborIds: ['itc-237', 'itc-231', 'itc-244']},
    {id: 'itc-239', vertexType: 'intersection', latitude: -7.7859791915485905, longitude: 110.3719809651375, label: 'Jalan Ngadikan', neighborIds: ['itc-232', 'itc-240', 'itc-235', 'itc-48']},
    {id: 'itc-240', vertexType: 'intersection', latitude: -7.786723285788581, longitude: 110.37224382162097, label: 'Jalan Faridan Muridan Noto', neighborIds: ['itc-239', 'itc-215', 'itc-236']},
    {id: 'itc-241', vertexType: 'intersection', latitude: -7.793475880590886, longitude: 110.37309408187868, label: 'Jalan Hayam Wuruk', neighborIds: ['itc-54', 'itc-203', 'itc-241']},
    {id: 'itc-243', vertexType: 'intersection', latitude: -7.794299684389008, longitude: 110.36817491054536, label: 'Jalan Mataram', neighborIds: ['itc-55', 'itc-245']},
    {id: 'itc-244', vertexType: 'intersection', latitude: -7.79035604119076, longitude: 110.3676974773407, label: 'Jalan Mataram', neighborIds: ['itc-238', 'itc-246', 'itc-247']},
    {id: 'itc-245', vertexType: 'intersection', latitude: -7.793858550943913, longitude: 110.36776185035707, label: 'Jalan Mataram', neighborIds: ['itc-243', 'itc-246']},
    {id: 'itc-246', vertexType: 'intersection', latitude: -7.792779632245832, longitude: 110.3676062822342, label: 'Jalan Mataram', neighborIds: ['itc-245', 'itc-244']},
    {id: 'itc-247', vertexType: 'intersection', latitude: -7.789808605304328, longitude: 110.36622762680055, label: 'Jalan Kleringan', neighborIds: ['itc-260', 'itc-244', 'itc-271']},
    {id: 'itc-248', vertexType: 'intersection', latitude: -7.787735783328405, longitude: 110.36638855934144, label: 'Jalan Margo Utomo', neighborIds: ['itc-260', 'itc-249', 'itc-254']},
    {id: 'itc-249', vertexType: 'intersection', latitude: -7.785992478957328, longitude: 110.3666138648987, label: 'Jalan Margo Utomo', neighborIds: ['itc-248', 'itc-250', 'itc-253']},
    {id: 'itc-250', vertexType: 'intersection', latitude: -7.785439722398359, longitude: 110.36669969558717, label: 'Jalan Margo Utomo', neighborIds: ['itc-249', 'itc-145', 'itc-251']},
    {id: 'itc-260', vertexType: 'intersection', latitude: -7.788899753854558, longitude: 110.36625981330873, label: 'Jalan Wongsodirjan', neighborIds: ['itc-258', 'itc-248', 'itc-247']},
    {id: 'itc-261', vertexType: 'intersection', latitude: -7.786075226081893, longitude: 110.38717527500947, label: 'Jalan Langensari', neighborIds: ['itc-32', 'itc-262']},
    {id: 'itc-262', vertexType: 'intersection', latitude: -7.79139015472485, longitude: 110.38616676441987, label: 'Jalan Langensari', neighborIds: ['itc-261', 'itc-56', 'itc-199', 'itc-99']},
    {id: 'itc-263', vertexType: 'intersection', latitude: -7.817987335473129, longitude: 110.39070010185242, label: 'Jalan Gambiran', neighborIds: ['itc-72', 'itc-264', 'itc-67', 'itc-267']},
    {id: 'itc-264', vertexType: 'intersection', latitude: -7.820485169673044, longitude: 110.4009246826172, label: 'Jalan Gambiran', neighborIds: ['itc-263', 'itc-64', 'itc-265']},
    {id: 'itc-269', vertexType: 'intersection', latitude: -7.801650068422085, longitude: 110.37796497344972, label: 'Jalan Supryotranoto', neighborIds: ['itc-51', 'itc-268', 'itc-209', 'itc-89']}, 
    {id: 'itc-270', vertexType: 'intersection', latitude: -7.787066100190221, longitude: 110.37873744964601, label: 'Jalan Kusbini', neighborIds: ['itc-261', 'itc-43', 'itc-56', 'itc-219']}
]

export default PERSIMPANGAN;
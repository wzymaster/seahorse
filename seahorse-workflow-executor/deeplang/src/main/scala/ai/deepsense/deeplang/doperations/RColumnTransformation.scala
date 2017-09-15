/**
 * Copyright 2015 deepsense.ai (CodiLime, Inc)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ai.deepsense.deeplang.doperations

import ai.deepsense.commons.utils.Version
import ai.deepsense.deeplang.DOperation._
import ai.deepsense.deeplang.doperables.RColumnTransformer
import scala.reflect.runtime.universe.TypeTag

import ai.deepsense.deeplang.documentation.OperationDocumentation

class RColumnTransformation
  extends TransformerAsOperation[RColumnTransformer] with OperationDocumentation {

  override val id: Id = "52e2652a-0c90-445e-87e9-a04f92ff75f0"
  override val name: String = "R Column Transformation"
  override val description: String =
    "Executes a custom R transformation on a column of a DataFrame"

  override lazy val tTagTO_1: TypeTag[RColumnTransformer] = typeTag

  override val since: Version = Version(1, 3, 0)
}
